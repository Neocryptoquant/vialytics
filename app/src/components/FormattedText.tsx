import React from "react";

/**
 * Simple markdown-like text formatter for chat messages
 * Converts basic markdown to React elements
 */

interface FormattedTextProps {
    text: string;
}

export function FormattedText({ text }: FormattedTextProps) {
    // Split text into paragraphs and format inline
    const paragraphs = text.split('\n\n');

    const formatInline = (str: string): React.ReactNode[] => {
        const parts: React.ReactNode[] = [];
        let remaining = str;
        let keyCounter = 0;

        while (remaining.length > 0) {
            // Check for bold **text**
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
            if (boldMatch && boldMatch.index !== undefined) {
                if (boldMatch.index > 0) {
                    parts.push(remaining.substring(0, boldMatch.index));
                }
                parts.push(<strong key={`b-${keyCounter++}`}>{boldMatch[1]}</strong>);
                remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
                continue;
            }

            // Check for code `text`
            const codeMatch = remaining.match(/`(.+?)`/);
            if (codeMatch && codeMatch.index !== undefined) {
                if (codeMatch.index > 0) {
                    parts.push(remaining.substring(0, codeMatch.index));
                }
                parts.push(
                    <code key={`c-${keyCounter++}`} className="bg-slate-100 px-1 rounded text-xs">
                        {codeMatch[1]}
                    </code>
                );
                remaining = remaining.substring(codeMatch.index + codeMatch[0].length);
                continue;
            }

            // No more formatting, add rest
            parts.push(remaining);
            break;
        }

        return parts;
    };

    return (
        <div className="space-y-2">
            {paragraphs.map((para, idx) => {
                const lines = para.split('\n');
                const formatted = lines.map((line, lineIdx) => {
                    // Bullet point
                    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                        return (
                            <li key={lineIdx} className="ml-4 list-disc">
                                {formatInline(line.trim().substring(2))}
                            </li>
                        );
                    }
                    // Return formatted line
                    return <div key={lineIdx}>{formatInline(line)}</div>;
                });

                return <div key={idx}>{formatted}</div>;
            })}
        </div>
    );
}
