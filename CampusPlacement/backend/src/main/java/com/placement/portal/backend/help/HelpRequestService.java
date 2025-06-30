package com.placement.portal.backend.help;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelpRequestService {

    @Autowired
    private HelpRequestRepository repository;

    @Autowired
    private UserRepository userRepository;

    public HelpRequest createHelpRequest(HelpRequestDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        HelpRequest request = new HelpRequest();
        request.setSubject(dto.getSubject());
        request.setMessage(dto.getMessage());
        request.setCategory(dto.getCategory());
        request.setUrgency(dto.getUrgency());
        request.setStatus(HelpStatus.OPEN);
        request.setUser(user);

        return repository.save(request);
    }

    public List<HelpRequest> getRequestsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return repository.findByUserId(user.getId());
    }

    public List<HelpRequest> getAllRequests() {
        return repository.findAll();
    }

    public HelpRequest updateStatus(Long id, HelpStatus status) {
        HelpRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return repository.save(request);
    }
}
