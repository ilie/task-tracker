import { marked } from 'marked'
import { TASK_KEYWORDS, DEFAULT_SECTIONS } from '../constants'

export function useMarkdownParser() {
  function parseTasksFromMarkdown(markdown) {
    const tasks = []
    let currentSection = DEFAULT_SECTIONS.GENERAL
    let taskIndex = 0

    const lines = markdown.split('\n')

    lines.forEach((line) => {
      // Check for heading
      const headingMatch = line.match(/^(#{1,6})\s+(.+)/)

      if (headingMatch) {
        const level = headingMatch[1].length
        const headingText = headingMatch[2].trim()
        const lowerText = headingText.toLowerCase()

        // Update current section for h2 headings
        if (level === 2) {
          currentSection = headingText
        }

        // Check if heading matches task keywords
        const isTaskHeading = TASK_KEYWORDS.some((keyword) =>
          lowerText.includes(keyword)
        )

        if (isTaskHeading) {
          const sectionName = level === 2
            ? DEFAULT_SECTIONS.MAIN_TASKS
            : (currentSection || DEFAULT_SECTIONS.TASKS)

          tasks.push({
            id: taskIndex++,
            text: headingText,
            checked: false,
            section: sectionName,
            isHeader: true,
            level: level,
          })
        }
      }

      // Check for checkbox items
      const checkboxMatch = line.match(/^\s*-\s+\[([ xX])\]\s*(.+)/)
      if (checkboxMatch) {
        const isChecked = checkboxMatch[1].toLowerCase() === 'x'
        const taskText = checkboxMatch[2].trim()

        tasks.push({
          id: taskIndex++,
          text: taskText,
          checked: isChecked,
          section: currentSection || DEFAULT_SECTIONS.TASKS,
          isHeader: false,
        })
      }
    })

    return tasks
  }

  function renderMarkdown(markdown) {
    // Remove checkbox syntax before rendering
    const cleanMarkdown = markdown.replace(/^\s*-\s+\[([ xX])\]\s*/gm, '- ')
    return marked.parse(cleanMarkdown)
  }

  return {
    parseTasksFromMarkdown,
    renderMarkdown
  }
}
