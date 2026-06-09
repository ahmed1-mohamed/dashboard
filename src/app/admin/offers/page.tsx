"use client";

import { useOffers } from "@/features/offers/hooks/useOffers";
import { OffersPageHeader } from "@/features/offers/components/OffersPageHeader";
import { OffersStatsCards } from "@/features/offers/components/OffersStatsCards";
import { OffersFilters } from "@/features/offers/components/OffersFilters";
import { OffersTable } from "@/features/offers/components/OffersTable";
import { OffersPagination } from "@/features/offers/components/OffersPagination";
import { OffersLoading, OffersError } from "@/features/offers/components/OffersStateViews";
import AddOfferModal from "@/components/modals/add-offer-modal";
import ViewOfferModal from "@/components/modals/view-offer-modal";
import EditOfferModal from "@/components/modals/edit-offer-modal";

export default function OffersPage() {
  const {
    offers,
    totalItems,
    totalPages,
    startIndex,
    totalsRaw,
    isLoading,
    isError,
    error,
    refetch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    getPageNumbers,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    selectedOffers,
    handleSelectAll,
    handleSelectOne,
    updatingOfferId,
    handleStatusToggle,
    handleDeleteClick,
    handleExportExcel,
    handleExportPdf,
    createModalOpen,
    setCreateModalOpen,
    viewModalOpenId,
    setViewModalOpenId,
    editModalOpenId,
    setEditModalOpenId,
    tableSettings,
    isColVisible,
  } = useOffers();

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1600px] mx-auto">
      <OffersPageHeader
        tableSettings={tableSettings}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        onCreateClick={() => setCreateModalOpen(true)}
      />

      {isLoading && <OffersLoading />}

      {isError && !isLoading && (
        <OffersError error={error} onRetry={refetch} />
      )}

      {!isLoading && !isError && (
        <>
          <OffersStatsCards totals={totalsRaw as any} />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <OffersFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={filterStatus}
                onStatusChange={setFilterStatus}
              />
            </div>

            <OffersTable
              offers={offers}
              selectedOffers={selectedOffers}
              updatingOfferId={updatingOfferId}
              isColVisible={isColVisible}
              handleSelectAll={handleSelectAll}
              handleSelectOne={handleSelectOne}
              handleStatusToggle={handleStatusToggle}
              onDeleteClick={handleDeleteClick}
              onViewClick={(offer) => setViewModalOpenId(offer.offer_id ?? offer.id ?? null)}
              onEditClick={(offer) => setEditModalOpenId(offer.offer_id ?? offer.id ?? null)}
            />

            {totalPages >= 1 && (
              <OffersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                getPageNumbers={getPageNumbers}
              />
            )}
          </div>
        </>
      )}

      <AddOfferModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={refetch}
      />

      <ViewOfferModal
        open={!!viewModalOpenId}
        onClose={() => setViewModalOpenId(null)}
        offerId={viewModalOpenId}
      />

      <EditOfferModal
        open={!!editModalOpenId}
        onClose={() => setEditModalOpenId(null)}
        offerId={editModalOpenId}
        onSuccess={refetch}
      />
    </div>
  );
}