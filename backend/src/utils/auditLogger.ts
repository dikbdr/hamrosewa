export const auditLog = (action: string, details: Record<string, unknown>) => {
  console.log(
    JSON.stringify({
      type: 'audit',
      timestamp: new Date().toISOString(),
      action,
      details,
    }),
  );
};
