// backend/utils/emailGenerator.js

const generateHTML = (sections, context = {}) => {
  if (!sections) return '';

  // 1. Helper to turn style object into string
  const renderStyle = (styleObj) => {
    return Object.entries(styleObj || {})
      .map(([k, v]) => {
        // Convert camelCase to kebab-case (e.g. backgroundColor -> background-color)
        const key = k.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        return `${key}: ${v};`;
      })
      .join(' ');
  };

  // 2. Helper to replace {{variables}}
  const processText = (text) => {
    let processed = text || '';
    Object.keys(context).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, context[key]);
    });
    return processed;
  };

  // 3. Generate HTML for each block
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

  // 4. Wrap in standard Email Shell
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>body { margin: 0; padding: 0; font-family: sans-serif; }</style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; min-height: 100vh;">
        ${blocks.join('')}
      </div>
    </body>
    </html>
  `;
};

module.exports = generateHTML;