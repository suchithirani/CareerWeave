package com.placement.portal.backend.help;

import com.placement.portal.backend.auth.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HelpArticleService {

    @Autowired
    private HelpArticleRepository repository;

    public HelpArticle createArticle(HelpArticleDto dto) {
        HelpArticle article = new HelpArticle();
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setRole(dto.getRole());
        article.setCategory(dto.getCategory());
        article.setUrgency(dto.getUrgency());
        article.setStatus(dto.getStatus());
        return repository.save(article);
    }

    public List<HelpArticle> getArticlesByRole(Role role) {
        return repository.findByRoleAndStatus(role, HelpArticleStatus.ACTIVE);
    }

    public Optional<HelpArticle> getById(Long id) {
        return repository.findById(id);
    }

    public HelpArticle updateArticle(Long id, HelpArticleDto dto) {
        HelpArticle article = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("HelpArticle not found"));

        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setRole(dto.getRole());
        article.setCategory(dto.getCategory());
        article.setUrgency(dto.getUrgency());
        article.setStatus(dto.getStatus());

        return repository.save(article);
    }

    public void deleteArticle(Long id) {
        repository.deleteById(id);
    }

    public List<HelpArticle> getAll() {
        return repository.findAll();
    }
}
