import nextra from "nextra";
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

const withNextra = nextra({
  search: true,
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});

export default withNextra({
  // ... Other Next.js config options
  // output: 'export'
});
