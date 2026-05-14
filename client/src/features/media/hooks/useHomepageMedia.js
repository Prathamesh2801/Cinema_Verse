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

        const heroCandidates = resolvedSections[0]?.items || [];

        setHeroMediaList(heroCandidates);
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
