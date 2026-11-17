-- ============================================================
-- EDUBRIDGE AI - DEMO DATA SEED
-- Run as Flyway migration: V2__seed_demo_data.sql
-- Safe to run once through Flyway; inserts are guarded to avoid
-- duplicating records if the SQL is manually re-run.
--
-- Uses the first existing TEACHER and STUDENT accounts, and the
-- teacher's existing courses and subjects. It does not create,
-- update, or delete users, courses, or subjects.
-- ============================================================

DO $seed$
DECLARE
    v_teacher_id UUID;
    v_student_id UUID;
    v_course RECORD;
    v_subject RECORD;
    v_assessment_id UUID;
    v_question_id UUID;
    v_result_id UUID;
    v_option_id UUID;
    v_first_assessment_id UUID;
    v_question_position INTEGER;
    v_option_position INTEGER;
    v_correct_option_text TEXT;
    v_question_text TEXT;
    v_topic TEXT;
    v_subject_counter INTEGER := 0;
    v_reward RECORD;
BEGIN
    -- Resolve existing accounts. No passwords are created or changed.
    SELECT id INTO v_teacher_id
    FROM users
    WHERE role = 'TEACHER'
    ORDER BY created_at, id
    LIMIT 1;

    SELECT id INTO v_student_id
    FROM users
    WHERE role = 'STUDENT'
    ORDER BY created_at, id
    LIMIT 1;

    IF v_teacher_id IS NULL THEN
        RAISE NOTICE 'No TEACHER user exists yet. Demo seed skipped — re-run Flyway after creating a teacher account.';
        RETURN;
    END IF;

    IF v_student_id IS NULL THEN
        RAISE NOTICE 'No STUDENT user exists yet. Demo seed skipped — re-run Flyway after registering a student.';
        RETURN;
    END IF;

    -- Enroll the demo student in up to three courses owned by this teacher.
    FOR v_course IN
        SELECT id, title
        FROM courses
        WHERE teacher_id = v_teacher_id
        ORDER BY created_at, id
        LIMIT 3
    LOOP
        INSERT INTO enrollments (student_id, course_id, status)
        VALUES (v_student_id, v_course.id, 'ACTIVE')
        ON CONFLICT (student_id, course_id) DO NOTHING;
    END LOOP;

    -- Seed notes, one assessment, five questions, and learning progress
    -- for every existing subject under this teacher's courses.
    FOR v_subject IN
        SELECT s.id, s.name, s.course_id, c.title AS course_title
        FROM subjects s
        JOIN courses c ON c.id = s.course_id
        WHERE c.teacher_id = v_teacher_id
        ORDER BY c.created_at, s.created_at, s.name
    LOOP
        v_subject_counter := v_subject_counter + 1;

        -- Two demo note records per subject.
        INSERT INTO notes
            (subject_id, uploaded_by, title, description, file_url, storage_path, file_type)
        SELECT
            v_subject.id,
            v_teacher_id,
            'Introduction to ' || v_subject.name,
            'Demo learning material covering the key concepts of ' || v_subject.name || '.',
            'https://example.com/demo-notes/' || v_subject.id::text || '-introduction.pdf',
            'demo-notes/' || v_subject.id::text || '/introduction.pdf',
            'PDF'
        WHERE NOT EXISTS (
            SELECT 1 FROM notes
            WHERE subject_id = v_subject.id
              AND title = 'Introduction to ' || v_subject.name
        );

        INSERT INTO notes
            (subject_id, uploaded_by, title, description, file_url, storage_path, file_type)
        SELECT
            v_subject.id,
            v_teacher_id,
            v_subject.name || ' - Practice Guide',
            'Demo practice guide with examples and revision points for ' || v_subject.name || '.',
            'https://example.com/demo-notes/' || v_subject.id::text || '-practice-guide.pdf',
            'demo-notes/' || v_subject.id::text || '/practice-guide.pdf',
            'PDF'
        WHERE NOT EXISTS (
            SELECT 1 FROM notes
            WHERE subject_id = v_subject.id
              AND title = v_subject.name || ' - Practice Guide'
        );

        -- One published practice assessment per subject.
        SELECT id INTO v_assessment_id
        FROM assessments
        WHERE subject_id = v_subject.id
          AND title = v_subject.name || ' - Practice Assessment'
        LIMIT 1;

        IF v_assessment_id IS NULL THEN
            INSERT INTO assessments
                (subject_id, created_by, title, description, total_marks,
                 duration_minutes, is_published)
            VALUES
                (v_subject.id, v_teacher_id,
                 v_subject.name || ' - Practice Assessment',
                 'A five-question demo assessment for ' || v_subject.name || '.',
                 5, 15, TRUE)
            RETURNING id INTO v_assessment_id;
        END IF;

        IF v_first_assessment_id IS NULL THEN
            v_first_assessment_id := v_assessment_id;
        END IF;

        -- Five sample MCQs per assessment. Questions are intentionally
        -- introductory/demo questions; replace with subject-specific
        -- questions before using this as real teaching content.
        FOR v_question_position IN 1..5 LOOP
            CASE v_question_position
                WHEN 1 THEN
                    v_question_text := 'What is the main purpose of learning ' || v_subject.name || '?';
                    v_correct_option_text := 'To understand and apply its core concepts';
                WHEN 2 THEN
                    v_question_text := 'Which is the most effective way to improve in ' || v_subject.name || '?';
                    v_correct_option_text := 'Practise concepts using examples and exercises';
                WHEN 3 THEN
                    v_question_text := 'What should a learner do when a concept in ' || v_subject.name || ' is unclear?';
                    v_correct_option_text := 'Review the material and work through a related example';
                WHEN 4 THEN
                    v_question_text := 'Which activity best checks understanding of ' || v_subject.name || '?';
                    v_correct_option_text := 'Solve a problem independently and explain the solution';
                ELSE
                    v_question_text := 'What is a useful next step after completing a topic in ' || v_subject.name || '?';
                    v_correct_option_text := 'Apply the concept in a small practical task';
            END CASE;

            SELECT id INTO v_question_id
            FROM questions
            WHERE assessment_id = v_assessment_id
              AND position = v_question_position
            LIMIT 1;

            IF v_question_id IS NULL THEN
                INSERT INTO questions
                    (assessment_id, question_text, question_type, marks,
                     correct_answer, position)
                VALUES
                    (v_assessment_id, v_question_text, 'MCQ', 1,
                     v_correct_option_text, v_question_position)
                RETURNING id INTO v_question_id;
            END IF;

            -- Add four options if this question does not already have options.
            IF NOT EXISTS (
                SELECT 1 FROM assessment_options
                WHERE question_id = v_question_id
            ) THEN
                INSERT INTO assessment_options
                    (question_id, option_text, is_correct, position)
                VALUES
                    (v_question_id, v_correct_option_text, TRUE, 1),
                    (v_question_id, 'To memorise unrelated information', FALSE, 2),
                    (v_question_id, 'To avoid practising or reviewing', FALSE, 3),
                    (v_question_id, 'To skip the underlying concepts', FALSE, 4);
            END IF;
        END LOOP;

        -- Initial progress record for the demo student.
        INSERT INTO learning_progress
            (student_id, subject_id, completed_topics, progress_percentage, last_activity_at)
        VALUES
            (v_student_id, v_subject.id,
             jsonb_build_array('Introduction'),
             20.00, CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, subject_id) DO NOTHING;

        -- Three demo doubts across the first three subjects.
        IF v_subject_counter <= 3 THEN
            INSERT INTO doubts (student_id, subject_id, question, answer, status, answered_at)
            SELECT
                v_student_id,
                v_subject.id,
                'Can you explain the fundamental concepts of ' || v_subject.name || ' with an example?',
                'Start with the basic definition, review the lesson notes, and practise one example step by step.',
                'ANSWERED',
                CURRENT_TIMESTAMP
            WHERE NOT EXISTS (
                SELECT 1 FROM doubts
                WHERE student_id = v_student_id
                  AND subject_id = v_subject.id
                  AND question = 'Can you explain the fundamental concepts of ' || v_subject.name || ' with an example?'
            );
        END IF;
    END LOOP;

    IF v_first_assessment_id IS NULL THEN
        RAISE NOTICE 'No subjects found under teacher courses. Skipping assessment seed.';
        RETURN;
    END IF;

    -- One evaluated demo result for the first assessment.
    SELECT id INTO v_result_id
    FROM results
    WHERE assessment_id = v_first_assessment_id
      AND student_id = v_student_id
    LIMIT 1;

    IF v_result_id IS NULL THEN
        INSERT INTO results
            (assessment_id, student_id, obtained_marks, total_marks, status)
        VALUES
            (v_first_assessment_id, v_student_id, 5, 5, 'EVALUATED')
        RETURNING id INTO v_result_id;
    END IF;

    -- Five correct demo answers, linked to the correct option rows.
    FOR v_question_id IN
        SELECT id
        FROM questions
        WHERE assessment_id = v_first_assessment_id
        ORDER BY position
        LIMIT 5
    LOOP
        SELECT id INTO v_option_id
        FROM assessment_options
        WHERE question_id = v_question_id
          AND is_correct = TRUE
        ORDER BY position
        LIMIT 1;

        IF NOT EXISTS (
            SELECT 1 FROM result_answers
            WHERE result_id = v_result_id
              AND question_id = v_question_id
        ) THEN
            INSERT INTO result_answers
                (result_id, question_id, selected_option_id,
                 answer_text, is_correct, marks_obtained)
            VALUES
                (v_result_id, v_question_id, v_option_id,
                 NULL, TRUE, 1);
        END IF;
    END LOOP;

    -- One career roadmap for the demo student.
    INSERT INTO roadmaps (student_id, career_goal, roadmap_data)
    SELECT
        v_student_id,
        'Full Stack Developer',
        jsonb_build_object(
            'goal', 'Full Stack Developer',
            'level', 'Beginner',
            'milestones', jsonb_build_array(
                jsonb_build_object('title', 'Web Fundamentals', 'status', 'IN_PROGRESS'),
                jsonb_build_object('title', 'Frontend Development', 'status', 'NOT_STARTED'),
                jsonb_build_object('title', 'Backend Development', 'status', 'NOT_STARTED'),
                jsonb_build_object('title', 'Database Fundamentals', 'status', 'NOT_STARTED'),
                jsonb_build_object('title', 'Build a Full Stack Project', 'status', 'NOT_STARTED')
            )
        )
    WHERE NOT EXISTS (
        SELECT 1 FROM roadmaps
        WHERE student_id = v_student_id
          AND career_goal = 'Full Stack Developer'
    );

    -- Three demo reward entries.
    FOR v_reward IN
        SELECT *
        FROM (VALUES
            (50, 'Completed profile setup'),
            (25, 'Enrolled in learning courses'),
            (10, 'Started the first learning subject')
        ) AS reward_data(points, reason)
    LOOP
        INSERT INTO rewards (student_id, points, reason)
        SELECT v_student_id, v_reward.points, v_reward.reason
        WHERE NOT EXISTS (
            SELECT 1 FROM rewards
            WHERE student_id = v_student_id
              AND reason = v_reward.reason
        );
    END LOOP;

    RAISE NOTICE 'EduBridge AI demo data seed completed. Teacher: %, Student: %',
        v_teacher_id, v_student_id;
END
$seed$;
