import { AdmissionEmailRequest, EmailResponse } from "@/types/email";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(
  request: NextRequest
): Promise<NextResponse<EmailResponse>> {
  try {
    const {
      name,
      email,
      subject,
      message,
      toEmail,
      admissionLetterUrl,
      qrCodeFile,
      examDetails,
    }: AdmissionEmailRequest = await request.json();

    if (!name || !email || !subject || !message || !toEmail) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const attachments: Array<{
      filename: string;
      content: string;
      encoding: string;
      cid: string;
    }> = [];

    if (qrCodeFile) {
      if (qrCodeFile.startsWith("data:image")) {
        attachments.push({
          filename: "admission-qr-code.png",
          content: qrCodeFile.split("base64,")[1],
          encoding: "base64",
          cid: "qrcode@admission",
        });
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Admission Letter: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .admission-box { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
            .qr-section { text-align: center; margin: 20px 0; padding: 20px; background-color: white; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .important { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Admission Confirmation</h1>
            </div>
            
            <div class="content">
              <h2>Dear ${name},</h2>
              
              <div class="admission-box">
                <p>${message.replace(/\n/g, "<br>")}</p>
              </div>

              ${
                examDetails
                  ? `
              <div class="important">
                <h3>📅 Exam Details</h3>
                <p><strong>Date:</strong> ${examDetails.date || "TBA"}</p>
                <p><strong>Time:</strong> ${examDetails.time || "TBA"}</p>
                <p><strong>Location:</strong> ${
                  examDetails.location || "TBA"
                }</p>
              </div>
              `
                  : ""
              }

              <div class="admission-box">
                <h3>📄 Your Admission Letter</h3>
                <p>Please download your official admission letter using the button below. You must bring this letter to the exam event.</p>
                
                ${
                  admissionLetterUrl
                    ? `
                <a href="${admissionLetterUrl}" style="color: #FFFFFF;" class="button" target="_blank">Download Admission Letter (PDF)</a>
                `
                    : ""
                }
              </div>

              ${
                qrCodeFile
                  ? `
              <div class="qr-section">
                <h3>QR Code for Entry</h3>
                <p>Please present this QR code at the exam venue for verification:</p>
                <img src="cid:qrcode@admission" alt="Admission QR Code" style="max-width: 250px; margin: 15px 0;"/>
                <p><small>Save this QR code or show this email at the entrance</small></p>
              </div>
              `
                  : ""
              }

              <div class="important">
                <h3>⚠️ Important Reminders</h3>
                <ul>
                  <li>Bring a printed copy or digital version of your admission letter</li>
                  <li>Arrive at least 30 minutes before the exam time</li>
                  <li>Bring a valid ID for verification</li>
                  <li>Save or screenshot the QR code above</li>
                </ul>
              </div>

              <p>If you have any questions, please reply to this email or contact us.</p>
              <p>Best wishes for your exam!</p>
            </div>

            <div class="footer">
              <p>This email was sent from exSTAD</p>
              <p>Please do not reply to this automated message</p>
              <p><strong>Contact:</strong> ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ADMISSION CONFIRMATION
        
        Dear ${name},
        
        ${message}
        
        ${
          examDetails
            ? `
        EXAM DETAILS:
        Date: ${examDetails.date || "TBA"}
        Time: ${examDetails.time || "TBA"}
        Location: ${examDetails.location || "TBA"}
        `
            : ""
        }
        
        ADMISSION LETTER:
        Download your admission letter here: ${
          admissionLetterUrl || "Link will be provided"
        }
        
        IMPORTANT REMINDERS:
        - Bring a printed copy or digital version of your admission letter
        - Arrive at least 30 minutes before the exam time
        - Bring a valid ID for verification
        - Save the QR code from the email
        
        If you have any questions, please contact us.
        
        Best wishes for your exam!
        
        ---
        This email was sent from exSTAD
        Contact: ${email}
      `,
      replyTo: email,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Admission email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
