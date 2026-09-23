import { Body, Controller, Get, Headers, Post, Query, UnauthorizedException } from '@nestjs/common';
import { LeadsService, Submission } from './leads.service';

@Controller()
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get('health')
  health() {
    return { ok: true, service: 'qiscet-api', time: new Date().toISOString(), sinks: this.leads.configuredSinks() };
  }

  @Post('leads')
  enquiry(@Body() body: Submission) {
    return this.leads.accept('enquiry', body, ['name', 'mobile']);
  }

  @Post('applications')
  application(@Body() body: Submission) {
    return this.leads.accept('application', body, ['mobileNumber']);
  }

  @Post('contact')
  contact(@Body() body: Submission) {
    return this.leads.accept('contact', body, ['name', 'email', 'message']);
  }

  @Post('grievance')
  grievance(@Body() body: Submission) {
    return this.leads.accept('grievance', body, ['subject', 'details']);
  }

  @Post('feedback')
  feedback(@Body() body: Submission) {
    return this.leads.accept('feedback', body, ['kind']);
  }

  @Post('newsletter')
  newsletter(@Body() body: Submission) {
    return this.leads.accept('newsletter', body, ['email']);
  }

  /** Recent submissions. Send header `x-admin-token: $ADMIN_TOKEN` (or ?token=). */
  @Get('admin/submissions')
  admin(@Headers('x-admin-token') header: string, @Query('token') query: string) {
    const expected = process.env.ADMIN_TOKEN;
    if (!expected || (header !== expected && query !== expected)) {
      throw new UnauthorizedException('Set ADMIN_TOKEN and pass it as the x-admin-token header.');
    }
    return { submissions: this.leads.recent() };
  }
}
