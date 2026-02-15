export const emailTemplate = {
  wrap(content: string, subject?: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || 'Vasantrao Naik Mahavidyalaya - Placement Portal'}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .email-body { padding: 20px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8f9fa; width: 100%;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        
        <!-- Email Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px 30px 25px 30px; border-radius: 8px 8px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; line-height: 1.3;">
                      Vasantrao Naik Mahavidyalaya
                    </h1>
                    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
                      Placement Management Portal
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="email-body" style="padding: 35px 30px 30px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 25px 30px; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <p style="margin: 0; color: #495057; font-size: 13px; font-weight: 600;">
                      Placement Cell Contact
                    </p>
                    <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 12px;">
                      Vasantrao Naik Mahavidyalaya, Airport Road, Cidco<br>
                      Aurangabad, Maharashtra - 431001
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 10px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 11px; text-align: center;">
                      This is an automated email from the College Placement Management Portal.<br>
                      Please do not reply directly to this email.
                    </p>
                    <p style="margin: 8px 0 0 0; color: #adb5bd; font-size: 10px; text-align: center;">
                      © ${new Date().getFullYear()} Vasantrao Naik Mahavidyalaya. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        
        <!-- Bottom Spacing -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td height="30" style="height: 30px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
  },

  heading(text: string): string {
    return `<h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 20px; font-weight: 600; line-height: 1.4;">${text}</h2>`;
  },

  paragraph(text: string): string {
    return `<p style="margin: 0 0 15px 0; color: #495057; font-size: 14px; line-height: 1.6;">${text}</p>`;
  },

  bulletList(items: string[]): string {
    const listItems = items.map(item => `
      <tr>
        <td width="24" valign="top" style="padding-right: 10px; padding-top: 3px;">
          <span style="display: inline-block; width: 6px; height: 6px; background-color: #2d5a87; border-radius: 50%;"></span>
        </td>
        <td style="padding-bottom: 8px;">
          <p style="margin: 0; color: #495057; font-size: 14px; line-height: 1.5;">${item}</p>
        </td>
      </tr>
    `).join('');

    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${listItems}
      </table>
    `;
  },

  button(text: string, url: string): string {
    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding-top: 20px; padding-bottom: 10px;">
            <a href="${url}" style="display: inline-block; background-color: #2d5a87; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
              ${text}
            </a>
          </td>
        </tr>
      </table>
    `;
  },

  alertBox(title: string, message: string, type: 'success' | 'warning' | 'info' = 'info'): string {
    const colors = {
      success: { bg: '#d4edda', border: '#28a745', text: '#155724' },
      warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
      info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' }
    };
    const color = colors[type];

    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="background-color: ${color.bg}; border-left: 4px solid ${color.border}; padding: 15px; border-radius: 4px;">
            <p style="margin: 0 0 5px 0; color: ${color.text}; font-size: 14px; font-weight: 600;">${title}</p>
            <p style="margin: 0; color: ${color.text}; font-size: 13px; line-height: 1.5;">${message}</p>
          </td>
        </tr>
      </table>
    `;
  },

  divider(): string {
    return `<div style="height: 1px; background-color: #e9ecef; margin: 20px 0;"></div>`;
  },

  signature(name: string, title: string = 'Training & Placement Officer'): string {
    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-top: 15px;">
            <p style="margin: 0; color: #1e3a5f; font-size: 14px; font-weight: 600;">${name}</p>
            <p style="margin: 3px 0 0 0; color: #6c757d; font-size: 12px;">${title}</p>
            <p style="margin: 3px 0 0 0; color: #6c757d; font-size: 12px;">Vasantrao Naik Mahavidyalaya</p>
          </td>
        </tr>
      </table>
    `;
  },
};
