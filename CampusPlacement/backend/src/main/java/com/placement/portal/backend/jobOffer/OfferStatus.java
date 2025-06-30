package com.placement.portal.backend.jobOffer;

public enum OfferStatus {
    PENDING,        // Offer sent but not yet responded to
    ACCEPTED,       // Candidate accepted the offer
    REJECTED,       // Candidate rejected the offer
    ONBOARDING,     // Candidate is completing onboarding tasks
    ONBOARDED       // Candidate has successfully completed onboarding
}
