import React from 'react'

export const parseText = (text: string, colorClass: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2)
      return (
        <strong key={i} className={`font-bold ${colorClass.split(' ')[0]} bg-white/5 px-1 py-0.5 rounded mx-0.5`}>
          {content}
        </strong>
      )
    }
    return part
  })
}
