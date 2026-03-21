package com.campusnexus.backend.repository;

import com.campusnexus.backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    // You can add custom queries later (search/filter)
}