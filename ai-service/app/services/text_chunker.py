
def chunk_text(text, chunk_size=500, overlap=50):
    """
    Split document text into smaller chunks without breaking words.

    chunk_size: Maximum number of characters in each chunk.
    overlap: Number of characters approximately repeated between chunks.
    """

    # Check empty text
    if not text or not text.strip():
        return []

    # Validate chunk settings
    if chunk_size <= 0:
        raise ValueError("Chunk size must be greater than zero.")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("Overlap must be smaller than chunk size.")

    words = text.split()

    chunks = []
    current_chunk = []
    current_length = 0

    for word in words:

        additional_length = len(word) + (
            1 if current_chunk else 0
        )

        # Check whether adding the word exceeds chunk size
        if current_chunk and current_length + additional_length > chunk_size:

            # Save the current chunk
            chunks.append(" ".join(current_chunk))

            # Preserve whole words for the next chunk's overlap
            overlap_words = []
            overlap_length = 0

            for previous_word in reversed(current_chunk):

                extra_length = len(previous_word) + (
                    1 if overlap_words else 0
                )

                if overlap_length + extra_length > overlap:
                    break

                overlap_words.insert(0, previous_word)
                overlap_length += extra_length

            # Start the next chunk with overlapping words
            current_chunk = overlap_words
            current_length = overlap_length

        # Add the next word
        current_chunk.append(word)

        current_length += len(word) + (
            1 if len(current_chunk) > 1 else 0
        )

    # Add the remaining words
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
