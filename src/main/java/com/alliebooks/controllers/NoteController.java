package com.alliebooks.controllers;

import com.alliebooks.models.ExpenseType;
import com.alliebooks.models.Note;
import com.alliebooks.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.UUID;

@RestController
@RequestMapping("/notes")
public class NoteController {
    @Autowired
    private NoteService noteService;

    @PostMapping
    public ResponseEntity<Note> create(@RequestBody Note note) throws URISyntaxException {
        var savedNote = noteService.save(note);
        return ResponseEntity.created(new URI("/Notes/" + savedNote.getId())).body(savedNote);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ExpenseType> delete(@PathVariable UUID id) {
        try {
            noteService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
