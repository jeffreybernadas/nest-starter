import { render } from '@react-email/components';
import { TestEmailTemplate } from '@/shared/mail/templates/test-email';
import { TestEmailTemplateProps } from '@/common/interfaces/email.interface';

export class EmailRenderer {
  /**
   * Renders the TestEmail template
   * @param data - Optional data to pass to the template
   * @returns Rendered HTML string
   */
  static async renderTestEmail(data?: TestEmailTemplateProps): Promise<string> {
    return await render(TestEmailTemplate(data));
  }

  /**
   * Generic method to render any email template
   * @param templateName - Name of the template to render
   * @param data - Data to pass to the template
   * @returns Rendered HTML string
   */
  static async renderTemplate<T>(
    templateName: string,
    data?: T,
  ): Promise<string> {
    switch (templateName) {
      case 'test-email':
        return await this.renderTestEmail(data as TestEmailTemplateProps);
      default:
        throw new Error(`Unknown email template: ${templateName}`);
    }
  }
}
