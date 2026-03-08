"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateArticle, deleteArticle } from "@/lib/actions/articles";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string | null;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  content: string;
  excerpt: string | null;
  categoryId: number | null;
  subcategory: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  seoKeyword: string | null;
  tags: string[];
  coverImage: string | null;
  coverImageAlt: string | null;
  status: string;
  isFeatured: boolean;
  sourceType: string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [subcategory, setSubcategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoKeyword, setSeoKeyword] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [status, setStatus] = useState("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([art, cats]) => {
      setArticle(art);
      setCategories(cats);
      setTitle(art.title);
      setSlug(art.slug);
      setSubtitle(art.subtitle || "");
      setCategoryId(art.categoryId || "");
      setSubcategory(art.subcategory || "");
      setExcerpt(art.excerpt || "");
      setContent(art.content);
      setMetaTitle(art.metaTitle || "");
      setMetaDescription(art.metaDescription || "");
      setSeoKeyword(art.seoKeyword || "");
      setTagsInput(art.tags?.join(", ") || "");
      setCoverImage(art.coverImage || "");
      setCoverImageAlt(art.coverImageAlt || "");
      setStatus(art.status);
      setIsFeatured(art.isFeatured);
      setLoading(false);
    }).catch(() => {
      setError("No se pudo cargar el artículo");
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      await updateArticle(id, {
        title, slug, content,
        excerpt: excerpt || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        subcategory: subcategory || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        seoKeyword: seoKeyword || undefined,
        tags,
        coverImage: coverImage || undefined,
        coverImageAlt: coverImageAlt || undefined,
        status,
        isFeatured,
      });
      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este artículo? Esta acción no se puede deshacer.")) return;
    try {
      await deleteArticle(id);
      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Cargando...</div>;
  }

  if (!article) {
    return <div className="py-12 text-center text-red-500">Artículo no encontrado</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-primary">Editar Artículo</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleDelete} className="px-4 py-2 text-red-500 hover:bg-red-50 text-sm rounded-lg transition-colors">
            Eliminar
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded" />
            Destacado
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full px-4 py-3 text-2xl font-display font-bold border-0 border-b border-gray-200 focus:outline-none focus:border-accent bg-transparent" />
          <div>
            <label className="block text-xs text-gray-400 mb-1">Subtitle</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Extracto</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Contenido (HTML)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={25} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">Categoría</h3>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Subcategoría</label>
              <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">Imagen</h3>
            <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="URL imagen" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
            <input type="text" value={coverImageAlt} onChange={(e) => setCoverImageAlt(e.target.value)} placeholder="Alt text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">SEO</h3>
            <div className="space-y-3">
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Meta título" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="Meta descripción" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
              <input type="text" value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} placeholder="Keyword" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">Tags</h3>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="tag1, tag2" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          {article.sourceType === "curated" && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-xs text-amber-700">
              Artículo curado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
