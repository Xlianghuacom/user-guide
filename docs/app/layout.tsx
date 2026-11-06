import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Dowalet 帮助中心',
    template: '%s | Dowalet 帮助中心'
  },
  description: 'Dowalet 钱包产品使用指南、账户操作说明和常见问题解答。',
  applicationName: 'Dowalet 帮助中心'
}

function brand(): ReactNode {
  return (
    <span className="dowalet-brand" aria-label="Dowalet 操作指引">
      <img
        className="dowalet-brand-logo"
        src="/dowalet-wordmark.png"
        alt=""
        width={685}
        height={137}
      />
      <span className="dowalet-brand-divider" aria-hidden="true" />
      <strong>操作指引</strong>
    </span>
  )
}

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap()

  return (
    <html lang="zh-CN" dir="ltr" suppressHydrationWarning>
      <Head
        color={{
          hue: { light: 336, dark: 336 },
          saturation: { light: 100, dark: 90 },
          lightness: { light: 50, dark: 60 }
        }}
        backgroundColor={{ light: '#ffffff', dark: '#171717' }}
      >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Layout
          navbar={
            <Navbar logo={brand()} logoLink="/docs" align="left" />
          }
          search={<Search placeholder="搜索关键词" />}
          pageMap={pageMap}
          sidebar={{
            defaultMenuCollapseLevel: 2,
            defaultOpen: true,
            toggleButton: true
          }}
          darkMode={false}
          toc={{ title: '本页目录', backToTop: '返回顶部' }}
          navigation={{ next: true, prev: true }}
          footer={
            <Footer className="wallet-footer">
              <span>Dowalet 帮助中心</span>
              <span>© {new Date().getFullYear()} Dowalet</span>
            </Footer>
          }
          copyPageButton={false}
          editLink={null}
          feedback={{ content: '' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

export default RootLayout
