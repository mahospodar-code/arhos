
import customtkinter as ctk
from tkinter import filedialog, messagebox
from PIL import Image
import os
import shutil
import re
import threading
from deep_translator import GoogleTranslator

# Configuration
TRANSLATIONS_FILE = os.path.join('src', 'data', 'translations.ts')
IMAGES_DIR = os.path.join('public', 'images')
MAX_IMAGE_WIDTH = 2500

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class ContentManagerApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("ARHOS Atelier - Content Manager")
        self.geometry("900x800")
        
        # Data Variables
        self.images_paths = []
        
        self.create_widgets()

    def create_widgets(self):
        # Grid Layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        
        # --- Title Section ---
        self.title_label = ctk.CTkLabel(self, text="Pridať Nový Projekt", font=("Roboto", 24, "bold"))
        self.title_label.grid(row=0, column=0, columnspan=2, pady=20)
        
        # --- Left Column (SK) ---
        self.frame_sk = ctk.CTkFrame(self)
        self.frame_sk.grid(row=1, column=0, padx=20, pady=10, sticky="nsew")
        
        ctk.CTkLabel(self.frame_sk, text="🇸🇰 Slovensky (SK)", font=("Roboto", 16, "bold")).pack(pady=10)
        
        self.entry_title_sk = ctk.CTkEntry(self.frame_sk, placeholder_text="Názov projektu (SK)")
        self.entry_title_sk.pack(pady=5, padx=10, fill="x")
        
        self.entry_loc_sk = ctk.CTkEntry(self.frame_sk, placeholder_text="Lokácia (napr. Bratislava, Slovensko)")
        self.entry_loc_sk.pack(pady=5, padx=10, fill="x")
        
        self.desc_sk = ctk.CTkTextbox(self.frame_sk, height=100)
        self.desc_sk.pack(pady=5, padx=10, fill="x")
        self.desc_sk.insert("0.0", "Popis projektu (SK)...")
        
        # --- Middle Action ---
        self.btn_translate = ctk.CTkButton(self, text="➔ Auto-Translate ➔", command=self.perform_translation)
        self.btn_translate.grid(row=1, column=0, columnspan=2, sticky="s", pady=(200, 10)) # Visual hack to place it between columns

        # --- Right Column (EN) ---
        self.frame_en = ctk.CTkFrame(self)
        self.frame_en.grid(row=1, column=1, padx=20, pady=10, sticky="nsew")
        
        ctk.CTkLabel(self.frame_en, text="🇬🇧 Anglicky (EN)", font=("Roboto", 16, "bold")).pack(pady=10)
        
        self.entry_title_en = ctk.CTkEntry(self.frame_en, placeholder_text="Project Title (EN)")
        self.entry_title_en.pack(pady=5, padx=10, fill="x")
        
        self.entry_loc_en = ctk.CTkEntry(self.frame_en, placeholder_text="Location (e.g. Bratislava, Slovakia)")
        self.entry_loc_en.pack(pady=5, padx=10, fill="x")
        
        self.desc_en = ctk.CTkTextbox(self.frame_en, height=100)
        self.desc_en.pack(pady=5, padx=10, fill="x")
        # Empty by default to show auto-translation working
        
        # --- Common Data (Center) ---
        self.frame_common = ctk.CTkFrame(self)
        self.frame_common.grid(row=2, column=0, columnspan=2, padx=20, pady=10, sticky="nsew")
        
        ctk.CTkLabel(self.frame_common, text="Spoločné Údaje", font=("Roboto", 16, "bold")).pack(pady=10)
        
        self.entry_year = ctk.CTkEntry(self.frame_common, placeholder_text="Rok (napr. 2024)")
        self.entry_year.pack(pady=5, padx=10, fill="x")
        
        self.entry_area = ctk.CTkEntry(self.frame_common, placeholder_text="Rozloha (napr. 150 m²)")
        self.entry_area.pack(pady=5, padx=10, fill="x")
        
        self.cat_var = ctk.StringVar(value="Rezidenčné")
        self.cat_menu = ctk.CTkOptionMenu(self.frame_common, variable=self.cat_var, values=["Rezidenčné", "Interiéry", "Komerčné"])
        self.cat_menu.pack(pady=5, padx=10, fill="x")
        
        # --- Images ---
        self.btn_images = ctk.CTkButton(self, text="Vybrať Fotky (Multiple)", command=self.select_images)
        self.btn_images.grid(row=3, column=0, columnspan=2, pady=10)
        
        self.lbl_images_count = ctk.CTkLabel(self, text="Žiadne fotky nevybrané")
        self.lbl_images_count.grid(row=4, column=0, columnspan=2)
        
        # --- Submit ---
        self.btn_submit = ctk.CTkButton(self, text="PUBLIKOVAŤ PROJEKT", fg_color="green", height=50, font=("Roboto", 18, "bold"), command=self.start_publish)
        self.btn_submit.grid(row=5, column=0, columnspan=2, pady=20, padx=50, sticky="ew")
        
        self.progress = ctk.CTkProgressBar(self)
        self.progress.grid(row=6, column=0, columnspan=2, padx=50, pady=10, sticky="ew")
        self.progress.set(0)

    def select_images(self):
        files = filedialog.askopenfilenames(filetypes=[("Images", "*.jpg *.jpeg *.png *.webp")])
        if files:
            self.images_paths = list(files)
            self.lbl_images_count.configure(text=f"Vybraných {len(files)} fotiek")

    def perform_translation(self):
        try:
            # Get SK values
            t_sk = self.entry_title_sk.get()
            l_sk = self.entry_loc_sk.get()
            d_sk = self.desc_sk.get("0.0", "end").strip()
            
            if not t_sk and not d_sk:
                messagebox.showwarning("Upozornenie", "Najprv vyplňte slovenské texty.")
                return

            translator = GoogleTranslator(source='sk', target='en')
            
            # Translate Title
            if t_sk:
                t_en = translator.translate(t_sk)
                self.entry_title_en.delete(0, 'end')
                self.entry_title_en.insert(0, t_en)
                
            # Translate Location
            if l_sk:
                l_en = translator.translate(l_sk)
                self.entry_loc_en.delete(0, 'end')
                self.entry_loc_en.insert(0, l_en)
                
            # Translate Description
            if d_sk:
                d_en = translator.translate(d_sk)
                self.desc_en.delete("0.0", 'end')
                self.desc_en.insert("0.0", d_en)
                
            messagebox.showinfo("Hotovo", "Preklad dokončený. Skontrolujte prosím anglické texty.")
            
        except Exception as e:
            messagebox.showerror("Chyba prekladu", str(e))

    def start_publish(self):
        # Basic Validation
        if not self.images_paths:
            messagebox.showerror("Chyba", "Musíte vybrať aspoň jednu fotku.")
            return
        
        if not self.entry_title_sk.get():
            messagebox.showerror("Chyba", "Musíte zadať slovenský názov.")
            return

        self.btn_submit.configure(state="disabled", text="Spracovávam...")
        self.progress.set(0)
        
        # Run in thread so GUI doesn't freeze
        threading.Thread(target=self.publish_logic).start()

    def publish_logic(self):
        try:
            # 1. Read Translations
            if not os.path.exists(TRANSLATIONS_FILE):
                raise Exception(f"Súbor {TRANSLATIONS_FILE} neexistuje!")
                
            with open(TRANSLATIONS_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 2. Find Max ID
            ids = re.findall(r'id:\s*(\d+),', content)
            new_id = (max(map(int, ids)) if ids else 0) + 1
            
            # 3. Process Images
            processed_image_paths = []
            
            if not os.path.exists(IMAGES_DIR):
                os.makedirs(IMAGES_DIR)

            total_imgs = len(self.images_paths)
            for i, img_path in enumerate(self.images_paths):
                # Update Progress
                self.progress.set((i / total_imgs) * 0.8)
                
                # WebP Convention: project_ID_index.webp
                base_name = f"project_{new_id}_{i+1}.webp"
                dest_path = os.path.join(IMAGES_DIR, base_name)
                
                # Resize and Convert
                with Image.open(img_path) as img:
                    # Calculate new height to keep aspect ratio
                    w, h = img.size
                    if w > MAX_IMAGE_WIDTH:
                        new_h = int((MAX_IMAGE_WIDTH / w) * h)
                        img = img.resize((MAX_IMAGE_WIDTH, new_h), Image.Resampling.LANCZOS)
                        
                    img.save(dest_path, "WEBP", quality=85)
                    processed_image_paths.append(f"/images/{base_name}")
            
            self.progress.set(0.9)
            
            # 4. Prepare Data
            title_sk = self.entry_title_sk.get()
            loc_sk = self.entry_loc_sk.get()
            desc_sk = self.desc_sk.get("0.0", "end").strip()
            cat_sk = self.cat_var.get()
            
            title_en = self.entry_title_en.get()
            loc_en = self.entry_loc_en.get()
            desc_en = self.desc_en.get("0.0", "end").strip()
            
            # Auto-Translate Fallback if empty and not triggered manually
            # But usually user would have clicked the button or filled it. 
            # If empty, we use SK as fallback to prevent crash, or could trigger translate here.
            # Let's keep it simple: fallback to SK if EN is empty.
            if not title_en: title_en = title_sk
            if not desc_en: desc_en = desc_sk
            
            # Map Category to EN
            cat_map = {"Rezidenčné": "Residential", "Interiéry": "Interiors", "Komerčné": "Commercial"}
            cat_en = cat_map.get(cat_sk, "Residential")
            
            year = self.entry_year.get()
            area = self.entry_area.get()
            
            images_str = "[\n" + ",\n".join([f"                        '{p}'" for p in processed_image_paths]) + "\n                    ]"
            
            # 5. Injection Logic
            def create_item(title, cat, loc, desc):
                return f"""                {{
                    id: {new_id},
                    title: '{title}',
                    category: '{cat}',
                    location: '{loc}',
                    year: '{year}',
                    images: {images_str},
                    description: '{desc.replace("'", "’")}',
                    area: '{area}',
                }},"""

            # In 'translations.ts', find insertion point for SK
            # Looking for 'items: [' inside 'projects: {' inside 'sk: {'
            # A bit tricky with regex, so we'll look for specific markers
            
            # Insert SK
            # We look for the last closing brace of the items array in SK section
            # Heuristic: Find "sk: {" -> then "projects: {" -> then "items: [" -> then find matching "],"
            
            # SIMPLIFICATION: We assume structure is consistent.
            # Find the index of "sk: {"
            idx_sk = content.find("sk: {")
            # Find "projects: {" after idx_sk
            idx_proj_sk = content.find("projects: {", idx_sk)
            # Find "items: [" after that
            idx_items_sk = content.find("items: [", idx_proj_sk)
            # Find the closing "]," for items
            # We can count braces or matching indentation
            # Let's search for the next "],"
            idx_end_sk = content.find("],", idx_items_sk)
            
            item_sk_str = create_item(title_sk, cat_sk, loc_sk, desc_sk)
            content = content[:idx_end_sk] + item_sk_str + "\n" + content[idx_end_sk:]
            
            # Insert EN
            # Now we must find EN section, but positions shifted.
            idx_en = content.find("en: {") # Find fresh known marker
            idx_proj_en = content.find("projects: {", idx_en)
            idx_items_en = content.find("items: [", idx_proj_en)
            idx_end_en = content.find("],", idx_items_en)
            
            item_en_str = create_item(title_en, cat_en, loc_en, desc_en)
            content = content[:idx_end_en] + item_en_str + "\n" + content[idx_end_en:]
            
            # 6. Write File
            with open(TRANSLATIONS_FILE, 'w', encoding='utf-8') as f:
                f.write(content)
                
            self.progress.set(1.0)
            self.after(0, lambda: messagebox.showinfo("Úspech", f"Projekt '{title_sk}' bol úspešne pridaný!"))
            self.after(0, lambda: self.reset_ui())
            
        except Exception as e:
            print(e)
            self.after(0, lambda: messagebox.showerror("Chyba", str(e)))
        finally:
            self.after(0, lambda: self.btn_submit.configure(state="normal", text="PUBLIKOVAŤ PROJEKT"))

    def reset_ui(self):
        self.entry_title_sk.delete(0, 'end')
        self.entry_title_en.delete(0, 'end')
        self.entry_loc_sk.delete(0, 'end')
        self.entry_loc_en.delete(0, 'end')
        self.desc_sk.delete("0.0", 'end')
        self.desc_sk.insert("0.0", "Popis projektu (SK)...")
        self.desc_en.delete("0.0", 'end')
        self.images_paths = []
        self.lbl_images_count.configure(text="Žiadne fotky nevybrané")
        self.progress.set(0)

if __name__ == "__main__":
    app = ContentManagerApp()
    app.mainloop()
