import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { redirect } from 'next/navigation'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps<'/[[...mdxPath]]'>) {
  const { mdxPath } = await props.params
  if (!mdxPath?.length) return {}
  const { metadata } = await importPage(mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps<'/[[...mdxPath]]'>) {
  const { mdxPath } = await props.params
  if (!mdxPath?.length) redirect('/docs')

  const result = await importPage(mdxPath)
  const { default: MDXContent, toc, metadata, sourceCode } = result
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={props.params} />
    </Wrapper>
  )
}
