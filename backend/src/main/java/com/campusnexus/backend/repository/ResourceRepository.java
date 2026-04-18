package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//Spring data JPA to build in CRUD operations
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
}