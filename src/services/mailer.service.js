import nodemailer from 'nodemailer';
const { SMTP_HOST, SMTP_PORT, SMTP_AUTH_USER, SMTP_AUTH_PASSWORD } = process.env;

export const sendMail = async (receiver, subject, body) => {
	// Créer un transporteur (Configuration SMPT)
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: +SMTP_PORT,
		auth: {
			user: SMTP_AUTH_USER,
			pass: SMTP_AUTH_PASSWORD,
		},
	});

	const info = await transporter.sendMail({
		from: 'no-reply@superdemo.com',
		to: receiver,
		subject: subject,
		text: '📢 Change de boite mail 📢', //TODO utiliser un moteur de templating,
		html: body,
	});

	console.log(info);
};
