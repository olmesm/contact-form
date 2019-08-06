# Serverless Contact form

Static sites are awesome, however we cant always use neat backend features like contact forms.

This is a serverless contact form inspired by [smashing contact form].

## Setup

Create an AWS user with programmatic access and Simple Email Service to do the mailing, along with other environment variables.

## Environment Variables

Setup environment variables required for deployment, by copying and editing the example values.

```sh
cp example.env .env
```

**Serverless User**

1. Sign Up for an AWS account or log in if you already have one.
1. In the AWS search bar, search for "IAM".
1. On the IAM page, click on "Users" on the sidebar, then the "Add user" button.
1. On the Add user page, give the user a name – something like "serverless-contact-form-user" is appropriate. Check "Programmatic access" under Access type then click next.
1. On the permissions screen, click on the "Attach existing policies directly" tab, search for "AdministratorAccess" in the list, check it, and click next.
1. On the review screen you should see your user name, with "Programmatic access", and "AdministratorAccess", then create the user.
1. Locally run:
   ```sh
   npm run sls -- config credentials --provider aws --key <AWS_KEY> --secret <AWS_SECRET>
   ```

**Simple Email Service**

1. Click Console Home in the top left corner to go home.
1. On the home page, in the AWS search bar, search for "Simple Email Service".
1. On the SES Home page, click on "Email Addresses" in the sidebar.
1. On the Email Addresses listing page, click the "Verify a New Email Address" button.
1. In the dialog window, type your email address then click "Verify This Email Address".
1. You’ll receive an email in moments containing a link to verify the address. Click on the link to complete the process.

## Develop

Please use [nvm]

```sh
# Set node version
nvm use

# Install Dependencies
npm install

# Run a sample form
npm run form

# Test
npm run sls -- invoke --function staticSiteMailer
```

## Deploy

```sh
# Deploy
npm run deploy
```

## Resources

- [smashing contact form]

<!-- MARKDOWN REFERENCES -->

[nvm]: https://github.com/nvm-sh/nvm
[smashing contact form]: https://www.smashingmagazine.com/2018/05/building-serverless-contact-form-static-website/
