import Mailgen from "mailgen";

var mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // This appears in header & footer of email!
    name: 'project camp',
    link: 'https://google.com'

  }
});


const userVerificationEmailContent = ({ name, verificationLink }) => {
  try {
    const email = {
      body: {
        name,
        intro: 'Welcome to project camp! We\'re very excited to have you on board.',
        action: {
          instructions: 'To verify your account please click on the link below:',
          button: {
            color: '#f34caa',
            text: 'Confirm your account',
            link: verificationLink
          }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
      }
    };

    const html = mailGenerator.generate(email)
   

    return { html }
  } catch (error) {
    console.log(error, "error generating mail template");
    throw error
  }

}

export {
  userVerificationEmailContent,
}