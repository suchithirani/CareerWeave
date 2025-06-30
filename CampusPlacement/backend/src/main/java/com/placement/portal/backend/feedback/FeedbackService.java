package com.placement.portal.backend.feedback;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepo;

    @Autowired
    private UserRepository userRepo;

    public Feedback submitFeedback(String email, FeedbackDto dto) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Feedback feedback = new Feedback();
        feedback.setSubject(dto.getSubject());
        feedback.setMessage(dto.getMessage());
        feedback.setUser(user);
        return feedbackRepo.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepo.findAll();
    }

    public List<Feedback> getFeedbackByUser(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return feedbackRepo.findByUser(user);
    }

    public Feedback respondToFeedback(Long id, String response) {
        Feedback feedback = feedbackRepo.findById(id).orElseThrow();
        feedback.setResponse(response);
        return feedbackRepo.save(feedback);
    }
}
