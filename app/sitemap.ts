import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{const base="https://about.fieldscholar.app";return[{url:base,priority:1},{url:`${base}/privacy`,priority:.3},{url:`${base}/terms`,priority:.3}]}
