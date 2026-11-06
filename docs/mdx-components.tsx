import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { UseMDXComponents } from 'nextra/mdx-components'

const { img: Image, ...docsComponents } = getDocsMDXComponents()

export const useMDXComponents: UseMDXComponents<typeof docsComponents> = <T,>(
  components?: T
) => ({
  ...docsComponents,
  img: (props: any) => (
    <Image
      {...props}
      className="nextra-border rounded-xl border drop-shadow-sm"
    />
  ),
  ...components
})
