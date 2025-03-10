
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
}: MagicLinkEmailProps) => {
  const isPasswordReset = email_action_type === 'recovery';
  
  const title = isPasswordReset 
    ? 'Reset Your Password'
    : 'Welcome to Renovation Receipts';
    
  const previewText = isPasswordReset
    ? 'Reset your Renovation Receipts password'
    : 'Your Renovation Receipts Login Link';
    
  const buttonText = isPasswordReset
    ? 'Reset Your Password'
    : 'Log In to Renovation Receipts';
    
  const instructionText = isPasswordReset
    ? 'Click the button below to reset your password and create a new one.'
    : 'Click the button below to log in to your account and start tracking your renovation expenses.';

  // Create the full reset URL for manual copying
  const fullResetUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>
            {instructionText}
          </Text>
          <Link
            href={fullResetUrl}
            target="_blank"
            style={{
              ...button,
              display: 'block',
              marginBottom: '16px',
            }}
          >
            {buttonText}
          </Link>
          <Text style={{ ...text, marginBottom: '8px' }}>
            Or, if the button doesn't work, copy and paste this URL into your browser:
          </Text>
          <Text style={linkBox}>
            {fullResetUrl}
          </Text>
          
          <Text style={{ ...text, marginBottom: '14px', marginTop: '20px' }}>
            Alternatively, use this temporary {isPasswordReset ? 'reset' : 'login'} code:
          </Text>
          <code style={code}>{token}</code>
          
          {isPasswordReset && (
            <Text style={{...text, marginTop: '20px', backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '5px', fontSize: '14px'}}>
              <strong>Note for Outlook users:</strong> If you're using Outlook or another email service with link protection, 
              try copying the link above and pasting it directly into your browser instead of clicking it.
            </Text>
          )}
          
          <Text
            style={{
              ...text,
              color: '#ababab',
              marginTop: '20px',
              marginBottom: '16px',
            }}
          >
            {isPasswordReset 
              ? "If you didn't request this password reset, you can safely ignore this email."
              : "If you didn't request this login link, you can safely ignore this email."
            }
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
}

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

const linkBox = {
  display: 'block',
  padding: '10px',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#2563eb',
  fontSize: '14px',
  wordBreak: 'break-all',
  overflowWrap: 'break-word',
  textAlign: 'left' as const,
}
