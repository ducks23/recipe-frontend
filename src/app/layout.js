import '../styles/globals.css'
import { AuthContextProvider } from '../lib/AuthContext'
import { ThemeProvider } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  console.error('Failed to apply theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthContextProvider>
            <Navbar />
            <main>{children}</main>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}