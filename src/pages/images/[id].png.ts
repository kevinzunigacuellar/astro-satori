import type { APIContext } from 'astro';
import satori from 'satori'
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

const pages = await import.meta.glob('../blog/*.md', { eager: true });

export async function get({ params, request } : APIContext) {
  let q = `../blog/${params.id}.md`;
  const { title, description } = pages[q].frontmatter;
  const Roboto = await fetch('https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff').then(res => res.arrayBuffer())
  const markup = html`
    <div style="color: #111827; width: 1200px; height: 768px; display: flex; flex-direction: column;">
      <div style="width: 100%; background-color: white; height: 80%; display:flex; justify-content: center; padding: 0px 50px; flex-direction: column;">
        <div style="font-size: 48px; font-weight: bold; color: #111827; padding-bottom: 20px;">${title}</div>
        <div style="color: #6b7280; font-size: 32px;">${description}</div>
      </div>
      <div style="background-color: #dbeafe; width: 100%; height: 20%; display: flex; align-items: center; justify-content: flex-end; padding: 0px 50px; border-top: 2px solid #bfdbfe;">
        <img src="https://avatars.githubusercontent.com/u/46791833?v=4" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 20px; border: 2px solid #60a5fa;" />
        <div style="font-size: 32px; color: #1e3a8a;">kevinzunigacuellar</div>
      </div>
    </div>`;
  const svg = await satori(markup, {
    width: 1200,
    height: 768,
    fonts: [
      {
        name: 'Roboto',
        data: Roboto,
      }
    ],
  });

  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return {
    body: pngBuffer,
    encoding: 'binary',
    headers: {
      'Content-Type': 'image/png',
    }
  }
};

export async function getStaticPaths() {
  const paths = Object.keys(pages).map((path) => {
    const [, id] = path.match(/\/blog\/(.*)\.md$/);
    return { params: { id } };
  });
  return paths;
}