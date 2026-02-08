import os
import re
import sys
import datetime

TRANSLATIONS_FILE = os.path.join('src', 'data', 'translations.ts')
IMAGES_DIR = os.path.join('public', 'images')

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    print("========================================")
    print("   ARHOS ATELIER - CONTENT ASSISTANT")
    print("========================================")

def get_input(prompt, required=True):
    while True:
        value = input(prompt).strip()
        if value or not required:
            return value
        print("  ! Toto pole je povinné.")

def find_max_id(content):
    ids = re.findall(r'id:\s*(\d+),', content)
    if not ids:
        return 0
    return max(map(int, ids))

def format_project_item(id, title, category, location, year, image):
    return f"""                {{
                    id: {id},
                    title: '{title}',
                    category: '{category}',
                    location: '{location}',
                    year: '{year}',
                    image: '{image}',
                }},"""

def add_project():
    print("\n--- PRIDANIE NOVÉHO PROJEKTU ---\n")
    
    # Common Data
    print("1. OBRAZOK")
    print(f"   (Uistite sa, ze obrazok je v priečinku {IMAGES_DIR})")
    while True:
        image_name = get_input("   Nazov suboru (napr. dom.jpg): ")
        if not os.path.exists(os.path.join(IMAGES_DIR, image_name)):
            print(f"   ! POZOR: Subor '{image_name}' sa nenasiel v {IMAGES_DIR}.")
            choice = get_input("   Chcete pokracovat aj tak? (a/n): ").lower()
            if choice == 'a':
                break
        else:
            print("   OK - Subor existuje.")
            break
            
    image_path = f"/images/{image_name}"
    
    year = get_input("   Rok (napr. 2024): ")
    
    # SK Data
    print("\n2. SLOVENSKE UDAJE (SK)")
    title_sk = get_input("   Nazov projektu (SK): ")
    location_sk = get_input("   Lokacia (SK, napr. Bratislava, Slovensko): ")
    
    print("   Kategoria (SK):")
    print("   [1] Rezidenčné")
    print("   [2] Interiéry")
    print("   [3] Komerčné")
    cat_choice = get_input("   Vyberte cislo (1-3): ")
    category_sk = "Rezidenčné"
    if cat_choice == '2': category_sk = "Interiéry"
    elif cat_choice == '3': category_sk = "Komerčné"
    
    # EN Data
    print("\n3. ANGLICKE UDAJE (EN)")
    title_en = get_input(f"   Project Title (EN) [Enter pre '{title_sk}']: ", required=False) or title_sk
    location_en = get_input(f"   Location (EN) [Enter pre '{location_sk}']: ", required=False) or location_sk
    
    category_en = "Residential"
    if category_sk == "Interiéry": category_en = "Interiors"
    elif category_sk == "Komerčné": category_en = "Commercial"
    print(f"   Category (EN): {category_en} (automaticky)")

    # Processing
    try:
        with open(TRANSLATIONS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_id = find_max_id(content) + 1
        
        # Insert Logic
        sk_marker = "sk: {"
        en_marker = "en: {"
        items_marker = "items: ["
        end_marker = "            ],"
        
        # SK Insert
        sk_start = content.find(sk_marker)
        if sk_start == -1: raise Exception("SK section not found")
        
        sk_items_start = content.find(items_marker, sk_start)
        if sk_items_start == -1: raise Exception("SK items not found")
        
        sk_items_end = content.find(end_marker, sk_items_start)
        if sk_items_end == -1: raise Exception("SK items closing not found")
        
        new_item_sk = format_project_item(new_id, title_sk, category_sk, location_sk, year, image_path)
        content = content[:sk_items_end] + new_item_sk + "\n" + content[sk_items_end:]
        
        # EN Insert
        # Recalculate positions because content length changed
        en_start = content.find(en_marker) 
        if en_start == -1: raise Exception("EN section not found")
        
        en_items_start = content.find(items_marker, en_start)
        if en_items_start == -1: raise Exception("EN items not found")
        
        en_items_end = content.find(end_marker, en_items_start)
        if en_items_end == -1: raise Exception("EN items closing not found")
        
        new_item_en = format_project_item(new_id, title_en, category_en, location_en, year, image_path)
        content = content[:en_items_end] + new_item_en + "\n" + content[en_items_end:]
        
        with open(TRANSLATIONS_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"\n[OK] Projekt '{title_sk}' (ID: {new_id}) bol uspesne pridany!")
        print("     Nezabudnite skontrolovat web.")
        
    except Exception as e:
        print(f"\n! CHYBA PRI ZAPISOVANI: {str(e)}")

def main():
    clear_screen()
    print_header()
    print("\nVitajte! Tento nastroj Vam pomoze spravovat obsah Vasej stranky.")
    print("---------------------------------------------------------------")
    print("1. Pridat novy projekt")
    print("2. Ukoncit")
    
    choice = get_input("\nVas vyber (1-2): ")
    
    if choice == '1':
        add_project()
    else:
        print("\nDovidenia.")

if __name__ == "__main__":
    main()
