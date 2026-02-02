/**
 * Generates HTML email from template sections
 * @param {Array} sections - Array of email sections
 * @param {Object} context - Context data for variable replacement
 * @returns {string} Complete HTML email string
 */
export const generateHTML = (sections, context = {}) => {
  if (!sections) return '';

  const renderStyle = (styleObj) => {
    return Object.entries(styleObj || {})
      .map(([k, v]) => {
        const key = k.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        return `${key}: ${v};`;
      })
      .join(' ');
  };

  const processText = (text) => {
    let processed = text || '';
    Object.keys(context).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, context[key]);
    });
    return processed;
  };

  const blocks = sections.map((section) => {
    const { type, data, style } = section;
    const inlineStyle = renderStyle(style);

    switch (type) {
      case 'header':
        return `
          <div style="${inlineStyle}; font-family: sans-serif; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: ${style.textColor || 'inherit'};">${processText(data.title)}</h1>
            ${data.subtitle ? `<p style="margin: 8px 0 0 0; opacity: 0.9; color: ${style.textColor || 'inherit'};">${processText(data.subtitle)}</p>` : ''}
          </div>
        `;
      case 'text':
        return `<div style="${inlineStyle}; font-family: sans-serif; line-height: 1.6;">${processText(data.content)}</div>`;
      case 'image':
        return `
          <div style="text-align: center; padding: 10px;">
            <img src="${data.url}" alt="${data.alt || 'Image'}" style="${inlineStyle}; max-width: 100%; display: block; margin: 0 auto;" />
          </div>
        `;
      case 'button':
        const btnWidth = style.width === 'full' ? 'display: block; width: 100%; box-sizing: border-box;' : 'display: inline-block;';
        return `
          <div style="padding: 20px; text-align: ${style.align || 'center'};">
            <a href="${data.url}" style="${inlineStyle}; ${btnWidth} text-decoration: none; padding: 12px 24px; font-weight: bold; font-family: sans-serif;">
              ${processText(data.label)}
            </a>
          </div>
        `;
      case 'spacer':
        return `<div style="height: ${style.height || '20px'};"></div>`;
      case 'footer':
        return `<div style="${inlineStyle}; font-family: sans-serif; text-align: center; font-size: 12px;">${processText(data.text)}</div>`;
      default:
        return '';
    }
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 20px; background-color: #f3f4f6; font-family: sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; min-height: 100vh;">
        ${blocks.join('')}
      </div>
    </body>
    </html>
  `;
};
