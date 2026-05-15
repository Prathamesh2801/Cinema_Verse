import { useEffect, useState } from "react";

import { homepageSections } from "../config/homepageSections";

import { normalizeMedia } from "../utils/normalizeMedia";

export const useHomepageMedia = () => {
  const [sections, setSections] = useState([]);

  const [featuredMedia, setFeaturedMedia] = useState(null);

  const [loading, setLoading] = useState(true);

  const [heroIndex, setHeroIndex] = useState(0);

  const [heroMediaList, setHeroMediaList] = useState([]);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const resolvedSections = await Promise.all(
          homepageSections.map(async (section) => {
            const rawData = await section.fetcher();

            const normalizedItems = rawData
              .map(normalizeMedia)
              .filter((item) => item.poster && item.title);

            return {
              ...section,
              items: normalizedItems,
            };
          }),
        );

        setSections(resolvedSections);
        // =====================================
        // 🎯 BUILD CINEMATIC HERO POOL
        // =====================================

        const heroCandidates = [
          ...(resolvedSections
            .find((s) => s.id === "trending")
            ?.items.slice(0, 8) || []),

          ...(resolvedSections
            .find((s) => s.id === "topRated")
            ?.items.slice(0, 8) || []),

          ...(resolvedSections
            .find((s) => s.id === "scifi")
            ?.items.slice(0, 8) || []),

          ...(resolvedSections
            .find((s) => s.id === "animated")
            ?.items.slice(0, 6) || []),

          ...(resolvedSections
            .find((s) => s.id === "hidden")
            ?.items.slice(0, 6) || []),
        ];

        // =====================================
        // 🎯 REMOVE DUPLICATES
        // =====================================

        const uniqueMap = new Map();

        heroCandidates.forEach((item) => {
          uniqueMap.set(`${item.id}-${item.mediaType}`, item);
        });

        const uniqueHeroMedia = Array.from(uniqueMap.values());

        // =====================================
        // 🎯 SHUFFLE HEROES
        // =====================================

        const shuffledHeroes = uniqueHeroMedia.sort(() => Math.random() - 0.5);

        setHeroMediaList(shuffledHeroes);
      } catch (err) {
        console.error("Homepage media load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  useEffect(() => {
    if (!heroMediaList.length) return;

    setFeaturedMedia(heroMediaList[heroIndex]);

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev >= heroMediaList.length - 1 ? 0 : prev + 1));
    }, 15000);

    return () => clearInterval(interval);
  }, [heroIndex, heroMediaList]);

  return {
    sections,
    featuredMedia,
    loading,
  };
};
