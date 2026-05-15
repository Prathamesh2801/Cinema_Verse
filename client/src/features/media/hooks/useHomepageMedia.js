import { useEffect, useState } from "react";

import { homepageSections } from "../config/homepageSections";
import { normalizeMedia } from "../utils/normalizeMedia";

const normalizeItems = (rawData) =>
  rawData
    .map(normalizeMedia)
    .filter((item) => item.poster && item.title);

const buildUniqueHeroPool = (items) => {
  const map = new Map();
  items.forEach((item) => {
    map.set(`${item.id}-${item.mediaType}`, item);
  });
  return Array.from(map.values()).sort(() => Math.random() - 0.5);
};

const appendUniqueHeroItems = (currentPool, newItems) => {
  const existingKeys = new Set(currentPool.map((item) => `${item.id}-${item.mediaType}`));
  const additions = newItems.filter((item) => !existingKeys.has(`${item.id}-${item.mediaType}`));
  return [...currentPool, ...additions.sort(() => Math.random() - 0.5)];
};

export const useHomepageMedia = () => {
  const [heroMediaList, setHeroMediaList] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroLoading, setHeroLoading] = useState(true);
  const [sections, setSections] = useState(
    homepageSections.map((section) => ({
      ...section,
      items: [],
      loading: true,
      error: null,
    })),
  );
  const [sectionsLoading, setSectionsLoading] = useState(true);

  const heroMedia = heroMediaList[heroIndex] || null;

  useEffect(() => {
    let active = true;

    const loadInitialHero = async () => {
      try {
        const trendingSection = homepageSections.find((section) => section.id === "trending");
        const topRatedSection = homepageSections.find((section) => section.id === "topRated");

        const [trendingRaw, topRatedRaw] = await Promise.all([
          trendingSection.fetcher(),
          topRatedSection.fetcher(),
        ]);

        const trendingItems = normalizeItems(trendingRaw);
        const topRatedItems = normalizeItems(topRatedRaw);

        if (!active) return;

        setSections((prev) =>
          prev.map((section) => {
            if (section.id === "trending") {
              return { ...section, items: trendingItems, loading: false };
            }
            if (section.id === "topRated") {
              return { ...section, items: topRatedItems, loading: false };
            }
            return section;
          }),
        );

        const heroCandidates = buildUniqueHeroPool([
          ...trendingItems.slice(0, 8),
          ...topRatedItems.slice(0, 8),
        ]);

        if (active) {
          setHeroMediaList(heroCandidates);
          setHeroIndex(0);
        }
      } catch (err) {
        console.error("Homepage hero load error:", err);
      } finally {
        if (active) {
          setHeroLoading(false);
        }
      }
    };

    loadInitialHero();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (heroLoading || heroMediaList.length <= 1) return undefined;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev >= heroMediaList.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [heroLoading, heroMediaList]);

  useEffect(() => {
    if (heroLoading) return undefined;

    let active = true;

    const appendHeroItems = (normalizedItems) => {
      setHeroMediaList((prev) => appendUniqueHeroItems(prev, normalizedItems));
    };

    const loadRows = async () => {
      const rowPromises = homepageSections
        .filter((section) => section.id !== "trending" && section.id !== "topRated")
        .map(async (section) => {
          try {
            const rawData = await section.fetcher();
            const normalizedItems = normalizeItems(rawData);

            if (!active) return;

            setSections((prev) =>
              prev.map((current) =>
                current.id === section.id
                  ? { ...current, items: normalizedItems, loading: false }
                  : current,
              ),
            );

            appendHeroItems(normalizedItems.slice(0, 4));
          } catch (err) {
            console.error(`Homepage section ${section.id} load error:`, err);
            if (!active) return;
            setSections((prev) =>
              prev.map((current) =>
                current.id === section.id
                  ? { ...current, loading: false, error: err }
                  : current,
              ),
            );
          }
        });

      await Promise.all(rowPromises);

      if (active) {
        setSectionsLoading(false);
      }
    };

    loadRows();

    return () => {
      active = false;
    };
  }, [heroLoading]);

  return {
    heroMedia,
    heroLoading,
    sections,
    sectionsLoading,
  };
};
