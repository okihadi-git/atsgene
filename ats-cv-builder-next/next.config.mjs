/** @type {import('next').NextConfig} */
export default { reactStrictMode: true, webpack: (c) => { c.resolve.alias.canvas = false; return c; } };
