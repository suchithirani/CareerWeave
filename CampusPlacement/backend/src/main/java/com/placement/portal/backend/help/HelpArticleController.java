package com.placement.portal.backend.help;

import com.placement.portal.backend.auth.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/help-articles")
public class HelpArticleController {

    @Autowired
    private HelpArticleService service;

    // ✅ Create new article (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HelpArticle> createArticle(@RequestBody HelpArticleDto dto) {
        return ResponseEntity.ok(service.createArticle(dto));
    }

    // ✅ Get all active articles for role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<HelpArticle>> getByRole(@PathVariable Role role) {
        return ResponseEntity.ok(service.getArticlesByRole(role));
    }

    // ✅ Get all articles (Admin view)
    @GetMapping
    public ResponseEntity<List<HelpArticle>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // ✅ Get article by ID
    @GetMapping("/{id}")
    public ResponseEntity<HelpArticle> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update article
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HelpArticle> update(@PathVariable Long id, @RequestBody HelpArticleDto dto) {
        return ResponseEntity.ok(service.updateArticle(id, dto));
    }

    // ✅ Delete article
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteArticle(id);
        return ResponseEntity.ok().build();
    }
}
