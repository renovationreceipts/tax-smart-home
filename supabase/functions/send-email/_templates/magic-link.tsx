
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface MagicLinkEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
}

export const MagicLinkEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Renovation Receipts Login Link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Renovation Receipts</Heading>
        <Text style={text}>
          Click the button below to log in to your account and start tracking your renovation expenses.
        </Text>
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          target="_blank"
          style={{
            ...button,
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Log In to Renovation Receipts
        </Link>
        <Text style={{ ...text, marginBottom: '14px' }}>
          Or, if the button doesn't work, copy and paste this temporary login code:
        </Text>
        <code style={code}>{token}</code>
        <Text
          style={{
            ...text,
            color: '#ababab',
            marginTop: '14px',
            marginBottom: '16px',
          }}
        >
          If you didn't request this login link, you can safely ignore this email.
        </Text>
        <Text style={footer}>
          <Link
            href="https://renovationreceipts.com"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Renovation Receipts
          </Link>
          {' '}- Track home improvement expenses & maximize tax savings
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 24px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  marginTop: '16px',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const footer = {
  color: '#898989',
  fontSize: '13px',
  lineHeight: '22px',
  marginTop: '32px',
  textAlign: 'center' as const,
}

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333',
  fontSize: '15px',
  textAlign: 'center' as const,
}
