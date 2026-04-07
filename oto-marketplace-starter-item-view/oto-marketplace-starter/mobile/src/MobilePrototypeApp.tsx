import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabs } from './components/BottomTabs';
import { CartSheet } from './components/CartSheet';
import { buildThreadIdFromParts, createMessage, fetchListings, fetchMessages, mapThreadMessages, mapThreadPreviews, updateListingCondition } from './lib/websiteApi';
import { BrowseScreen } from './screens/BrowseScreen';
import { ContactProfileScreen } from './screens/ContactProfileScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InboxScreen } from './screens/InboxScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SavedScreen } from './screens/SavedScreen';
import { SellerProfileScreen } from './screens/SellerProfileScreen';
import { ThreadScreen } from './screens/ThreadScreen';
import { palette } from './theme';
import { AppView, Listing, MessagePreview, TabKey, ThreadMessage } from './types';

export function MobilePrototypeApp() {
  const currentUserId = 'user_mia';
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [view, setView] = useState<AppView>({ name: 'tabs' });
  const [listings, setListings] = useState<Listing[]>([]);
  const [threads, setThreads] = useState<MessagePreview[]>([]);
  const [threadMessages, setThreadMessages] = useState<Record<string, ThreadMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredDistance, setFeaturedDistance] = useState(3);
  const [browseQuery, setBrowseQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  async function loadWebsiteData() {
    try {
      setLoading(true);
      setError(null);

      const [liveListings, liveMessages] = await Promise.all([fetchListings(), fetchMessages()]);
      const liveThreads = mapThreadPreviews(liveMessages).map((thread) => {
        const listingId = thread.id.split(':')[0];
        const participantIds = thread.id.split(':').slice(1);
        const listing = liveListings.find((item) => item.id === listingId);
        const mode: 'buying' | 'selling' = listing?.sellerId === currentUserId ? 'selling' : 'buying';
        const participantId = participantIds.find((id) => id !== currentUserId) || listing?.sellerId;

        return {
          ...thread,
          imageUrl: listing?.image,
          mode,
          participantId,
          initials: thread.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        };
      });
      const nextThreadMessages: Record<string, ThreadMessage[]> = {};

      for (const preview of liveThreads) {
        nextThreadMessages[preview.id] = mapThreadMessages(liveMessages, preview.id);
      }

      setListings(liveListings);
      setThreads(liveThreads);
      setThreadMessages(nextThreadMessages);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Could not reach the website data.';
      setError(`${message} Check that the Next.js site is running and EXPO_PUBLIC_API_BASE_URL points to it.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWebsiteData();
  }, []);

  function openListing(listingId: string, sourceTab = activeTab) {
    setView({ name: 'listing', listingId, sourceTab });
  }

  function openThread(threadId: string) {
    setView({ name: 'thread', threadId });
  }

  function openSellerProfile(
    sellerId: string,
    sellerName: string,
    initials: string,
    options?: { backToThreadId?: string; backToListingId?: string; backToSourceTab?: TabKey },
  ) {
    setView({ name: 'seller', sellerId, sellerName, initials, ...options });
  }

  function openOrCreateThreadForListing(listing: Listing, sourceTab: TabKey) {
    if (!listing.sellerId) {
      throw new Error('Seller details are missing for this listing.');
    }

    const threadId = buildThreadIdFromParts(listing.id, currentUserId, listing.sellerId);
    const existingThread = threads.find((item) => item.id === threadId);

    if (!existingThread) {
      const nextThread: MessagePreview = {
        id: threadId,
        listingId: listing.id,
        participantId: listing.sellerId,
        name: listing.seller,
        listingTitle: listing.title,
        preview: '',
        time: 'Now',
        unread: false,
        imageUrl: listing.image,
        mode: listing.sellerId === currentUserId ? 'selling' : 'buying',
        initials: listing.seller
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      };

      setThreads((current) => [nextThread, ...current]);
      setThreadMessages((current) => ({
        ...current,
        [threadId]: current[threadId] || [],
      }));
    }

    setActiveTab(sourceTab);
    setView({ name: 'thread', threadId });
  }

  function openContact(name: string, initials: string, subtitle?: string, sellerId?: string, threadId?: string) {
    setView({ name: 'contact', contactName: name, initials, subtitle, sellerId, threadId });
  }

  async function sendListingMessage(listing: Listing, message: string) {
    if (!listing.sellerId) {
      throw new Error('Seller details are missing for this listing.');
    }

    await createMessage({
      senderId: currentUserId,
      recipientId: listing.sellerId,
      listingId: listing.id,
      listingTitle: listing.title,
      message,
    });

    await loadWebsiteData();
    const nextThreadId = buildThreadIdFromParts(listing.id, currentUserId, listing.sellerId);
    setView({ name: 'thread', threadId: nextThreadId });
  }

  async function markListingPending(listing: Listing, participantId: string) {
    if (!listing.sellerId || !participantId) {
      throw new Error('Participant details are missing for this listing.');
    }

    await updateListingCondition(listing.id, {
      actorId: currentUserId,
      condition: 'Pending',
    });

    await createMessage({
      senderId: currentUserId,
      recipientId: participantId,
      listingId: listing.id,
      listingTitle: listing.title,
      message: `I've agreed to collection and marked this item as pending for you.`,
    });

    await loadWebsiteData();
  }

  function submitBrowseSearch(query: string) {
    const next = query.trim();
    setBrowseQuery(next);
    setActiveTab('browse');
    setView({ name: 'tabs' });
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
      const sellerInitials = listing.seller
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      return (
        <View style={styles.app}>
          <ListingDetailScreen
            listing={listing}
            onBack={goBack}
            onOpenProfile={() =>
              listing.sellerId &&
              openSellerProfile(listing.sellerId, listing.seller, sellerInitials, {
                backToListingId: listing.id,
                backToSourceTab: view.sourceTab,
              })
            }
            onOpenMessageThread={() => openOrCreateThreadForListing(listing, view.sourceTab)}
            onSendCollectRequest={(message) => sendListingMessage(listing, message)}
          />
        </View>
      );
    }
  }

  if (view.name === 'thread') {
    const thread = threads.find((item) => item.id === view.threadId);

    if (thread) {
      const listing = thread.listingId ? listings.find((item) => item.id === thread.listingId) : undefined;
      const participantId = thread.participantId;
      const canMarkPending =
        Boolean(listing) &&
        listing?.sellerId === currentUserId &&
        listing?.category === 'Free Stuff' &&
        !listing.condition.toLowerCase().includes('pending');

      return (
        <View style={styles.app}>
          <ThreadScreen
            thread={thread}
            messages={threadMessages[thread.id] || []}
            onBack={goBack}
            onOpenListing={() => thread.listingId && openListing(thread.listingId, 'inbox')}
            onOpenContact={() =>
              openContact(thread.name, thread.initials || thread.name.slice(0, 2).toUpperCase(), thread.listingTitle, participantId, thread.id)
            }
            canMarkPending={canMarkPending}
            onMarkPending={listing && participantId ? () => markListingPending(listing, participantId) : undefined}
            onSendMessage={
              listing && participantId
                ? (message) =>
                    createMessage({
                      senderId: currentUserId,
                      recipientId: participantId,
                      listingId: listing.id,
                      listingTitle: listing.title,
                      message,
                    }).then(loadWebsiteData)
                : undefined
            }
          />
        </View>
      );
    }
  }

  if (view.name === 'contact') {
    const handleContactBack = () => {
      if (view.threadId) {
        setView({ name: 'thread', threadId: view.threadId });
        return;
      }

      goBack();
    };

    return (
      <View style={styles.app}>
        <ContactProfileScreen
          name={view.contactName}
          initials={view.initials}
          subtitle={view.subtitle}
          onBack={handleContactBack}
          onViewProfile={
            view.sellerId
              ? () =>
                  openSellerProfile(view.sellerId!, view.contactName, view.initials, {
                    backToThreadId: view.threadId,
                  })
              : undefined
          }
        />
      </View>
    );
  }

  if (view.name === 'seller') {
    const sellerListings = listings.filter((listing) => listing.sellerId === view.sellerId);
    const handleSellerBack = () => {
      if (view.backToThreadId) {
        setView({ name: 'thread', threadId: view.backToThreadId });
        return;
      }

      const inferredThread = threads.find((thread) => thread.participantId === view.sellerId);
      if (inferredThread) {
        setView({ name: 'thread', threadId: inferredThread.id });
        return;
      }

      if (view.backToListingId) {
        setView({ name: 'listing', listingId: view.backToListingId, sourceTab: view.backToSourceTab || activeTab });
        return;
      }

      goBack();
    };

    return (
      <View style={styles.app}>
        <SellerProfileScreen
          sellerName={view.sellerName}
          initials={view.initials}
          listings={sellerListings}
          onBack={handleSellerBack}
          onOpenListing={(listingId) => openListing(listingId, activeTab)}
        />
      </View>
    );
  }

  const sortedByDistance = [...listings].sort((a, b) => (a.distanceMiles ?? Number.POSITIVE_INFINITY) - (b.distanceMiles ?? Number.POSITIVE_INFINITY));
  const inRangeListings = sortedByDistance.filter((listing) => (listing.distanceMiles ?? Number.POSITIVE_INFINITY) <= featuredDistance);
  const fallbackListings = inRangeListings.length > 0 ? inRangeListings : sortedByDistance;
  const historyListings = [...fallbackListings].sort((a, b) => a.title.localeCompare(b.title)).slice(0, 8);
  const freeListings = fallbackListings.filter((listing) => listing.price.includes('£0') || listing.price.toLowerCase().includes('free')).slice(0, 8);
  const personalizedListings = fallbackListings.slice(0, 10);
  const savedListings = listings.slice(1, 3);
  const cartItems = listings.slice(0, 2);

  return (
    <View style={styles.app}>
      {activeTab === 'home' ? (
        <HomeScreen
          historyListings={historyListings}
          freeListings={freeListings}
          personalizedListings={personalizedListings}
          loading={loading}
          error={error}
          onRetry={loadWebsiteData}
          activeDistance={featuredDistance}
          onChangeDistance={setFeaturedDistance}
          onOpenListing={(listingId) => openListing(listingId, 'home')}
          onSearch={submitBrowseSearch}
          onOpenCart={() => setIsCartOpen(true)}
        />
      ) : null}
      {activeTab === 'browse' ? (
        <BrowseScreen
          listings={listings}
          loading={loading}
          error={error}
          searchQuery={browseQuery}
          onChangeSearchQuery={setBrowseQuery}
          onSubmitSearch={submitBrowseSearch}
          onOpenListing={(listingId) => openListing(listingId, 'browse')}
          onOpenCart={() => setIsCartOpen(true)}
        />
      ) : null}
      {activeTab === 'saved' ? (
        <SavedScreen listings={savedListings} onOpenListing={(listingId) => openListing(listingId, 'saved')} onOpenBrowse={() => setActiveTab('browse')} />
      ) : null}
      {activeTab === 'inbox' ? <InboxScreen threads={threads} loading={loading} error={error} onOpenThread={openThread} /> : null}
      {activeTab === 'profile' ? <ProfileScreen /> : null}
      <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
      <CartSheet visible={isCartOpen} items={cartItems} onClose={() => setIsCartOpen(false)} onOpenListing={openListing} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: palette.white,
  },
});
