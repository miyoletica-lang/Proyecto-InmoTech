const formatPhoneNumber = (phone) => {
  if (!phone) return phone;

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('3') && cleaned.length === 10) {
    return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
};

const parseFullName = (fullName) => {
  if (!fullName) return { primer_nombre: '', primer_apellido: '' };

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return { primer_nombre: parts[0], primer_apellido: '' };
  }

  if (parts.length === 2) {
    return { primer_nombre: parts[0], primer_apellido: parts[1] };
  }

  if (parts.length === 3) {
    return {
      primer_nombre: parts[0],
      segundo_nombre: parts[1],
      primer_apellido: parts[2]
    };
  }

  return {
    primer_nombre: parts[0],
    segundo_nombre: parts[1],
    primer_apellido: parts[2],
    segundo_apellido: parts.slice(3).join(' '),
  };
};

const buildFullName = (persona) => {
  const parts = [
    persona.primer_nombre,
    persona.segundo_nombre,
    persona.primer_apellido,
    persona.segundo_apellido,
  ].filter(Boolean);

  return parts.join(' ');
};

const checkTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

module.exports = {
  formatPhoneNumber,
  parseFullName,
  buildFullName,
  checkTimeOverlap,
};
