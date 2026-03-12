'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePatients } from '@/lib/queries/patients';
import { useTranslations } from '@/i18n/use-translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@ehr-mx/shared';

export default function PatientsPage() {
  const { data: session } = useSession();
  const t = useTranslations('patients');
  const tg = useTranslations('general');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = usePatients({
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? (statusFilter as 'PROVISIONAL' | 'COMPLETE') : undefined,
    page,
    limit: 20,
  });

  const role = session?.role;
  const canCreateFull = role === Role.DOCTOR;
  const canCreateProvisional =
    role === Role.RECEPTION || role === Role.NURSE;

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        {canCreateFull && (
          <Link href="/patients/new?mode=full">
            <Button>{t.newPatient}</Button>
          </Link>
        )}
        {canCreateProvisional && (
          <Link href="/patients/new?mode=provisional">
            <Button>{t.newProvisionalPatient}</Button>
          </Link>
        )}
      </div>

      <div className="flex gap-4">
        <Input
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allStatuses}</SelectItem>
            <SelectItem value="PROVISIONAL">{t.provisional}</SelectItem>
            <SelectItem value="COMPLETE">{t.complete}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{tg.loading}</p>
      ) : !data?.data.length ? (
        <p className="text-muted-foreground">{t.noPatients}</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.curp}</TableHead>
                <TableHead>{t.fullName}</TableHead>
                <TableHead>{t.phone}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{tg.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-mono text-sm">
                    {patient.curp ?? '—'}
                  </TableCell>
                  <TableCell>
                    {patient.name} {patient.paternalSurname}{' '}
                    {patient.maternalSurname ?? ''}
                  </TableCell>
                  <TableCell>{patient.phone ?? '—'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patient.status === 'COMPLETE'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {patient.status === 'COMPLETE'
                        ? t.complete
                        : t.provisional}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/patients/${patient.id}`}>
                      <Button variant="ghost" size="sm">
                        {tg.view}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {tg.previous}
              </Button>
              <span className="text-sm text-muted-foreground">
                {tg.page} {page} {tg.of} {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {tg.next}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
