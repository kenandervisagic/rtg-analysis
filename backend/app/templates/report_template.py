def render_html(data: dict) -> str:
    diagnosis = data.get("diagnosis", "N/A")
    confidence = data.get("confidence", 0)
    insights = data.get("insights", [])
    image_base64 = data.get("imageBase64", "")
    img_tag = f'<img src="{image_base64}" alt="Analizirana X-zraka" />' if image_base64 else ""

    # (HTML content can be reused from your previous full template)
    # To keep this message concise, assume the full `html_content` is returned here
    return f"""
                <!DOCTYPE html>
                <html lang="hr">
                <head>
                    <meta charset="UTF-8" />
                    <title>Klinički Nalaz - PneumoAI</title>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet">
                    <style>
                        @page {{
                            margin: 0;
                        }}
                        /* Reset */
                        * {{
                            box-sizing: border-box;
                        }}

                        body {{
                            font-family: 'Poppins', Arial, sans-serif;
                            padding: 2.5rem 3rem;
                            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                            color: #222222;
                            position: relative;
                            min-height: 100vh;
                        }}

                        header {{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 2px solid #7c3aed;
                            padding-bottom: 0.5rem;
                            margin-bottom: 2rem;
                        }}

                        .title {{
                            font-weight: 600;
                            font-size: 2.5rem;
                            color: #7c3aed;
                            letter-spacing: 1px;
                            user-select: none;
                            text-shadow: 0 2px 5px rgba(124, 58, 237, 0.4);
                        }}

                        .brand {{
                            font-weight: 700;
                            font-size: 1.4rem;
                            color: #4c1d95;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            user-select: none;
                            text-shadow: 0 1px 3px rgba(76, 29, 149, 0.5);
                        }}

                        section {{
                            margin-bottom: 2.5rem;
                        }}

                        h1, h2 {{
                            color: #4c1d95;
                            font-weight: 600;
                            margin-bottom: 0.7rem;
                            border-bottom: 2px solid #7c3aed;
                            padding-bottom: 0.25rem;
                        }}

                        p {{
                            font-weight: 300;
                            line-height: 1.5;
                            font-size: 1rem;
                            margin-top: 0.4rem;
                        }}

                        .confidence {{
                            font-weight: 600;
                            color: #7c3aed;
                            font-size: 1.25rem;
                            margin-top: 0.3rem;
                        }}

                        .insight {{
                            margin-top: 0.75rem;
                            font-size: 1rem;
                            line-height: 1.6;
                            color: #3b3b3b;
                            background-color: #f0ebff;
                            padding: 12px 15px;
                            border-left: 5px solid #7c3aed;
                            border-radius: 6px;
                        }}

                        img {{
                            display: block;
                            max-width: 60%;
                            margin: 0 auto 2rem auto;
                            border-radius: 12px;
                            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                            border: 1px solid #7c3aed88;
                        }}

                        footer {{
                            position: absolute;
                            bottom: 2rem;
                            left: 3rem;
                            right: 3rem;
                            font-size: 0.75rem;
                            font-style: italic;
                            color: #666666;
                            border-top: 1px solid #ddd;
                            padding-top: 0.75rem;
                            text-align: center;
                            user-select: none;
                        }}
                    </style>
                </head>
                <body>
                    <header>
                        <div class="title">Klinički Nalaz</div>
                        <div class="brand">PneumoAI</div>
                    </header>
                        {img_tag}
                    <section>
                        <h2>Dijagnoza</h2>
                        <p>{diagnosis}</p>
                    </section>

                    <section>
                        <h2>Stepen sigurnosti</h2>
                        <p class="confidence">{confidence:.1f}%</p>
                    </section>

                    <section>
                        <h2>Interpretacija</h2>
                        {"".join(f'<div class="insight">{ins}</div>' for ins in insights)}
                    </section>

                    <footer>
                        Napomena: Ovaj nalaz je generisan korištenjem umjetne inteligencije kao podrška medicinskoj dijagnostici. 
                        Ne zamjenjuje profesionalni medicinski pregled i mišljenje ljekara.
                    </footer>
                </body>
                </html>
            """