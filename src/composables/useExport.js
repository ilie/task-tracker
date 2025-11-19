export function useExport() {
  function exportAsMarkdown(tasks, includeChecked = true) {
    const grouped = {}

    tasks.forEach(task => {
      if (!grouped[task.section]) {
        grouped[task.section] = []
      }
      grouped[task.section].push(task)
    })

    let markdown = ''

    Object.entries(grouped).forEach(([section, sectionTasks]) => {
      markdown += `## ${section}\n\n`

      sectionTasks.forEach(task => {
        if (task.isHeader) {
          markdown += `### ${task.text}\n`
        } else {
          const checkbox = task.checked ? '[x]' : '[ ]'
          markdown += `- ${checkbox} ${task.text}\n`
        }
      })

      markdown += '\n'
    })

    return markdown
  }

  function exportAsJSON(data) {
    return JSON.stringify(data, null, 2)
  }

  function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      return false
    }
  }

  function exportTasks(tasks, format = 'markdown') {
    const timestamp = new Date().toISOString().split('T')[0]

    if (format === 'markdown') {
      const content = exportAsMarkdown(tasks)
      downloadFile(content, `tasks-${timestamp}.md`, 'text/markdown')
      return content
    } else if (format === 'json') {
      const content = exportAsJSON({ tasks, exportedAt: new Date().toISOString() })
      downloadFile(content, `tasks-${timestamp}.json`, 'application/json')
      return content
    }
  }

  return {
    exportAsMarkdown,
    exportAsJSON,
    exportTasks,
    copyToClipboard,
    downloadFile
  }
}
