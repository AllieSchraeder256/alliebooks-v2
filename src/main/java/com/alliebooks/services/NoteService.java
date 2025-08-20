package com.alliebooks.services;

import com.alliebooks.models.Note;
import com.alliebooks.repositories.NoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoteService extends BaseCrudService<Note> {

	@Autowired
	private NoteRepo repository;

	public NoteService(NoteRepo repository) {
		super(repository);
	}
}
