"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/lib/actions/articles";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string | null;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
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
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManual) setSlug(generateSlug(val));
  };

  const estimateReadingTime = (text: string) => {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleMdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/articles/parse-md", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al procesar");
      }

      const parsed = await res.json();

      setTitle(parsed.title || "");
      setSlug(parsed.slug || "");
      setSlugManual(!!parsed.slug);
      setContent(parsed.content || "");
      setExcerpt(parsed.excerpt || "");
      setMetaTitle(parsed.metaTitle || "");
      setMetaDescription(parsed.metaDescription || "");
      setSeoKeyword(parsed.seoKeyword || "");
      setTagsInput(parsed.keywords?.join(", ") || "");
      setFaqItems(parsed.faqItems || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir archivo");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Título y contenido son obligatorios");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createArticle({
        title: title.trim(),
        slug: slug.trim(),
        content,
        excerpt: excerpt.trim() || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        subcategory: subcategory.trim() || undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        seoKeyword: seoKeyword.trim() || undefined,
        tags,
        coverImage: coverImage.trim() || undefined,
        coverImageAlt: coverImageAlt.trim() || undefined,
        readingTime: estimateReadingTime(content),
        status,
        isFeatured,
        faqItems: faqItems.length > 0 ? JSON.stringify(faqItems) : undefined,
      });

      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-display font-bold text-primary">Nuevo Artículo</h1>
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept=".md"
              onChange={handleMdUpload}
              className="hidden"
              disabled={uploading}
            />
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border-2 border-dashed transition-colors ${uploading ? "border-gray-200 text-gray-400" : "border-accent/40 text-accent hover:bg-accent/5 hover:border-accent"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {uploading ? "Procesando..." : "Subir .md"}
            </span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded"
            />
            Destacado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicar</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título del artículo"
            className="w-full px-4 py-3 text-2xl font-display font-bold border-0 border-b border-gray-200 focus:outline-none focus:border-accent bg-transparent placeholder:text-gray-300"
          />

          <div>
            <label className="block text-xs text-gray-400 mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManual(true);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Extracto</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Resumen corto (máx 500 chars)..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Contenido (HTML)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={25}
              placeholder="<h2>Sección</h2>&#10;<p>Contenido del artículo...</p>"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">Categoría</h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Subcategoría / Ciudad</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="ej: cartagena"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">Imagen de portada</h3>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="URL de la imagen"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2"
            />
            <input
              type="text"
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              placeholder="Alt text (SEO)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            {coverImage && (
              <img src={coverImage} alt="Preview" className="mt-3 rounded-lg w-full aspect-video object-cover" />
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Meta título</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={200}
                  placeholder="Título para Google"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Meta descripción</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  maxLength={320}
                  placeholder="Descripción para Google"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Keyword objetivo</label>
                <input
                  type="text"
                  value={seoKeyword}
                  onChange={(e) => setSeoKeyword(e.target.value)}
                  placeholder="ej: airbnb cartagena precios"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-primary mb-3">Tags</h3>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="cartagena, airbnb, precios"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <p className="text-[10px] text-gray-400 mt-1">Separar con comas</p>
          </div>

          {faqItems.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-primary mb-3">
                FAQ ({faqItems.length} preguntas)
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {faqItems.map((faq, i) => (
                  <details key={i} className="text-xs">
                    <summary className="cursor-pointer font-medium text-gray-700 hover:text-accent">
                      {faq.question}
                    </summary>
                    <p className="mt-1 text-gray-500 pl-3">{faq.answer.substring(0, 150)}...</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
