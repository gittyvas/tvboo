import os
import re
import json
import requests
from datetime import datetime

# 1. API Configuration
TMDB_API_KEY = "b42f186fb9d11d6400e72487cf70507a"
OUTPUT_DIR = "sport"  # Saves inside your designated folder structure
os.makedirs(OUTPUT_DIR, exist_ok=True)

def sanitize_filename(title):
    """Convert titles to safe JSON file names."""
    clean = re.sub(r'[^\w\s-]', '', title).strip().lower()
    return re.sub(r'[-\s]+', '_', clean) + ".json"

def get_genre_mapping():
    """Fetch official TMDB movie genre ID to name mapping."""
    url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}&language=en-US"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            return {g["id"]: g["name"] for g in res.json().get("genres", [])}
    except Exception:
        pass
    return {}

def fetch_movie_details(movie_id):
    """Fetch extended credits, trailers, and watch providers for a specific movie ID."""
    details_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits,videos,watch/providers"
    try:
        res = requests.get(details_url, timeout=10)
        if res.status_code == 200:
            return res.json()
    except Exception as e:
        print(f"  [!] Error fetching details for movie ID {movie_id}: {e}")
    return {}

def main():
    print("Fetching top 50 high-popularity movies from TMDB...\n")
    
    genre_map = get_genre_mapping()

    movies = []
    # Fetching pages 1, 2, and 3 from TMDB popular endpoint (20 items per page = 60 items)
    for page in range(1, 4):
        popular_url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page={page}"
        try:
            response = requests.get(popular_url, timeout=10)
            if response.status_code == 200:
                results = response.json().get("results", [])
                movies.extend(results)
            else:
                print(f"Failed to fetch page {page}. Status code: {response.status_code}")
        except Exception as e:
            print(f"Error fetching page {page}: {e}")

    # Slice strictly to the top 50 items
    movies = movies[:50]
    print(f"Processing {len(movies)} high-popularity titles...\n")

    for movie in movies:
        tmdb_id = movie.get("id")
        title = movie.get("title") or movie.get("original_title")
        popularity = movie.get("popularity", 0.0)
        release_date = movie.get("release_date", "Unknown")
        
        # Fetch deeper enriched data (credits, videos, providers)
        full_data = fetch_movie_details(tmdb_id)
        
        # Extract Genres
        genre_ids = movie.get("genre_ids", [])
        genres = [genre_map.get(gid) for gid in genre_ids if gid in genre_map]
        
        # Extract Cast (Top 6 actors)
        cast_list = []
        credits = full_data.get("credits", {})
        for actor in credits.get("cast", [])[:6]:
            profile_path = f"https://image.tmdb.org/t/p/w500{actor['profile_path']}" if actor.get("profile_path") else None
            cast_list.append({
                "name": actor.get("name"),
                "character": actor.get("character"),
                "profile_path": profile_path
            })

        # Extract Trailer URL (Prefer YouTube Official Trailer)
        trailer_url = None
        videos = full_data.get("videos", {}).get("results", [])
        for vid in videos:
            if vid.get("site") == "YouTube" and vid.get("type") in ["Trailer", "Teaser"]:
                trailer_url = f"https://www.youtube.com/watch?v={vid.get('key')}"
                break

        # Extract US Watch Providers
        providers_list = []
        wp_data = full_data.get("watch/providers", {}).get("results", {}).get("US", {})
        flatrate = wp_data.get("flatrate", [])
        rent_buy = wp_data.get("rent", []) + wp_data.get("buy", [])
        
        for p in (flatrate + rent_buy):
            logo_path = f"https://image.tmdb.org/t/p/w500{p['logo_path']}" if p.get("logo_path") else None
            providers_list.append({
                "provider_name": p.get("provider_name"),
                "logo_path": logo_path,
                "link": f"https://www.themoviedb.org/movie/{tmdb_id}/watch?locale=US"
            })

        # Construct final payload including popularity & release date
        payload = {
            "tmdb_id": tmdb_id,
            "media_type": "movie",
            "slug": sanitize_filename(title).replace(".json", ""),
            "title": title,
            "tagline": full_data.get("tagline", ""),
            "first_air_date": release_date,
            "rating": str(movie.get("vote_average", 0.0)),
            "vote_count": movie.get("vote_count", 0),
            "popularity": popularity,
            "genres": genres,
            "status": full_data.get("status", "Released"),
            "network": full_data.get("production_companies", [{}])[0].get("name", "Theatrical") if full_data.get("production_companies") else "Theatrical",
            "poster": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get("poster_path") else None,
            "backdrop": f"https://image.tmdb.org/t/p/original{movie.get('backdrop_path')}" if movie.get("backdrop_path") else None,
            "overview": movie.get("overview", ""),
            "trailer_url": trailer_url,
            "cast": cast_list,
            "watch_providers": providers_list
        }

        filename = sanitize_filename(title)
        filepath = os.path.join(OUTPUT_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=4)

        # Print title, release date, and popularity score in the terminal
        print(f"-> Saved: {title} | Release Date: {release_date} | Popularity: {popularity} -> {filepath}")

    print("\nIngestion of top 50 high-popularity movies complete!")

if __name__ == "__main__":
    main()
