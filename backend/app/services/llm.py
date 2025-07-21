from openai import OpenAI

client = OpenAI()

def generate_clinical_summary(result: str, confidence: float) -> str:
    confidence_percent = round(confidence * 100, 1)
    prompt = (
        f"Duboko učenje je analiziralo snimak grudnog koša i dijagnosticiralo **{result}** "
        f"sa sigurnošću od **{confidence_percent:.1f}%**. "
        f"Molimo napišite sažet profesionalni klinički izvještaj za radiologa ili pulmologa. "
        f"Sažmite nalaz, interpretirajte nivo sigurnosti, navedite relevantne daljnje pretrage ili snimanja "
        f"i predložite kliničke preporuke – sve u jedinstvenom koherentnom pasusu bez nabrajanja ili naslova. "
        f"Molim sažeti nalaz u kraćem, jasnom odlomku bez nepotrebnih detalja."
    )

    chat_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system",
             "content": "Vi ste radiolog koji pruža profesionalne dijagnostičke nalaze za druge ljekare."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=300,
    )

    return chat_response.choices[0].message.content.strip()
