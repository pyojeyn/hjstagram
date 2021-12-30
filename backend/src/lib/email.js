import nodemailer from 'nodemailer';
//email
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jeynpyo@gmail.com',
        pass: 'jane1994!@'
    },
});

export const getPasswordResetURL = (user, token) => 
`http://localhost:3000/update-password/${user._id}/${token}`;

export const resetPasswordTemplate = (user, url) => {
    const from = 'hjstagram'
    const to = user.email
    const subject = "📧hjstagram 비밀번호 재설정 링크"
    const html = `
    <p>안녕하세요 ${user.name || user.email}님</p>
    <p>비밀번호 재설정을 위한 링크를 메일로 보내드렸습니다.</p>
    <a href=${url}>${url}</a>
    <p>-hjstagram-</p>
    `
    return { from, to, subject, html }
  }