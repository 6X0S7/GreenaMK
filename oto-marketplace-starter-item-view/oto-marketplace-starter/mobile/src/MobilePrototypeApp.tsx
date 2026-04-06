import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabs } from './components/BottomTabs';
import { fetchListings, fetchMessages, mapThreadMessages, mapThreadPreviews } from './lib/websiteApi';
import { BrowseScreen } from './screens/BrowseScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InboxScreen } from './screens/InboxScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SavedScreen } from './screens/SavedScreen';
import { ThreadScreen } from './screens/ThreadScreen';
import { palette } from './theme';
import { AppView, Listing, MessagePreview, TabKey, ThreadMessage } from './types';

export function MobilePrototypeApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [view, setView] = useState<AppView>({ name: 'tabs' });
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<MessagePreview[]>([]);
  const [threadMessages, setThreadMessages] = useState<Record<string, ThreadMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWebsiteData() {
      try {
        setLoading(true);
        setError(null);

        const [liveListings, liveMessages] = await Promise.all([fetchListings(), fetchMessages()]);
        const liveThreads = mapThreadPreviews(liveMessages);
        const nextThreadMessages: Record<string, ThreadMessage[]> = {};

        for (const preview of liveThreads) {
          nextThreadMessages[preview.id] = mapThreadMessages(liveMessages, preview.id);
        }

        if (cancelled) {
          return;
        }

        setListings(liveListings);
        setThreads(liveThreads);
        setThreadMessages(nextThreadMessages);
      } catch (loadError) {
        if (!cancelled) {
          const message = loadError instanceof Error ? loadError.message : 'Could not reach the website data.';
          setError(`${message} Check that the Next.js site is running and EXPO_PUBLIC_API_BASE_URL points to it.`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWebsiteData();

    return () => {
      cancelled = true;
    };
  }, []);

  function openListing(listingId: string, sourceTab = activeTab) {
    setView({ name: 'listing', listingId, sourceTab });
  }

  function openThread(threadId: string) {
    setView({ name: 'thread', threadId });
  }

  function goBack() {
    if (view.name === 'listing') {
      setActiveTab(view.sourceTab);
    }

    setView({ name: 'tabs' });
  }

  if (view.name === 'listing') {
    const listing = listings.find((item) => item.id === view.listingId);

    if (listing) {
      return (
        <View style={styles.app}>
          <ListingDetailScreen listing={listing} onBack={goBack} />
        </View>
      );
    }
  }

  if (view.name === 'thread') {
    const thread = threads.find((item) => item.id === view.threadId);

    if (thread) {
      return (
        <View style={styles.app}>
          <ThreadScreen thread={thread} messages={threadMessages[thread.id] || []} onBack={goBack} />
        </View>
      );
    }
  }

  const featuredListings = listings.slice(0, 3);
  const savedListings = listings.slice(1, 3);

  return (
    <View style={styles.app}>
      {activeTab === 'home' ? (
        <HomeScreen
          listings={featuredListings}
          loading={loading}
          error={error}
          onOpenListing={(listingId) => openListing(listingId, 'home')}
          onOpenBrowse={() => setActiveTab('browse')}
        />
      ) : null}
      {activeTab === 'browse' ? (
        <BrowseScreen listings={listings} loading={loading} error={error} onOpenListing={(listingId) => openListing(listingId, 'browse')} />
      ) : null}
      {activeTab === 'saved' ? (
        <SavedScreen listings={savedListings} onOpenListing={(listingId) => openListing(listingId, 'saved')} onOpenBrowse={() => setActiveTab('browse')} />
      ) : null}
      {activeTab === 'inbox' ? <InboxScreen threads={threads} loading={loading} error={error} onOpenThread={openThread} /> : null}
      {activeTab === 'profile' ? <ProfileScreen /> : null}
      <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: palette.white,
  },
});
