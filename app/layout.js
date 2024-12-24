import '../styles/globals.css'; // Import global styles

export const metadata = {
  title: 'EstiMate',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='h-full bg-light-background'>
      <body className='h-full'>{children}</body>
    </html>
  );
}
