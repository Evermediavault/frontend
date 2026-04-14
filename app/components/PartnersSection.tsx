'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getPartnerTags,
  getPartners,
  type PartnerItem,
} from '../../lib/request';
import { toUserFacingError } from '../../lib/userFacingError';
import PartnerDetailModal from './PartnerDetailModal';

type PartnersSectionProps = {
  /** Forwarded to the root `<section>` for scroll observers on the home page. */
  sectionRef: React.Ref<HTMLElement>;
  isVisible: boolean;
};

export default function PartnersSection({ sectionRef, isVisible }: PartnersSectionProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailPartner, setDetailPartner] = useState<PartnerItem | null>(null);

  const loadPartners = useCallback(async (tag: string | null) => {
    const list =
      tag != null && tag.length > 0
        ? await getPartners({ tag })
        : await getPartners();
    setPartners(list);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const tagList = await getPartnerTags();
        if (cancelled) return;
        setTags(tagList);

        if (tagList.length >= 2) {
          const first = tagList[0];
          setSelectedTag(first);
          await loadPartners(first);
        } else {
          setSelectedTag(null);
          await loadPartners(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(toUserFacingError(e));
          setPartners([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [loadPartners]);

  const onSelectTag = async (tag: string) => {
    if (tag === selectedTag) return;
    setSelectedTag(tag);
    setLoading(true);
    setError(null);
    try {
      await loadPartners(tag);
    } catch (e) {
      setError(toUserFacingError(e));
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const showTabs = tags.length >= 2;

  return (
    <>
      <PartnerDetailModal
        partner={detailPartner}
        onClose={() => setDetailPartner(null)}
      />

      <section
        ref={sectionRef}
        className={`relative -top-48 px-4 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Partners</h2>

          {showTabs ? (
            <div className="flex flex-wrap gap-6 md:gap-8 mb-12 border-b border-gray-800">
              {tags.map((tag) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => void onSelectTag(tag)}
                    className={`pb-3 font-medium transition-colors ${
                      active
                        ? 'text-blue-400 border-b-2 border-blue-400 -mb-px'
                        : 'text-gray-400 hover:text-white border-b-2 border-transparent -mb-px'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          ) : null}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-card p-6 rounded-xl flex items-center justify-center h-24 animate-pulse bg-white/5"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-red-400/90" role="alert">
              {error}
            </p>
          ) : partners.length === 0 ? (
            <p className="text-gray-400 text-sm">No partners to display.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {partners.map((partner) => (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => setDetailPartner(partner)}
                  className="glass-card p-6 rounded-xl flex flex-col items-center justify-center gap-2 min-h-[6rem] hover:scale-105 transition-all duration-300 hover:border-blue-500/50 text-center"
                >
                  <div className="relative h-10 w-full max-w-[120px]">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-gray-400 text-xs font-medium line-clamp-2">
                    {partner.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
