import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import {
  UserResponse,
  ResearchOutputCreationRequest,
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import { useAuth0 } from '@asap-hub/react-context';

import { API_BASE_URL } from '../config';
import { useFetchOptions, BasicOptions, useApiGet } from './util';

export const useCreateResearchOutput = () => {
  const { user } = useAuth0();

  const { data: profile, get, abort: abortProfileRequest } = useFetch<
    UserResponse
  >(
    `${API_BASE_URL}/users/invites/${encodeURIComponent(
      user?.sub || 'unknown',
    )}`,
  );
  useEffect(() => {
    if (user) {
      get();
    }
    return abortProfileRequest;
  }, [user, get, abortProfileRequest]);

  const { loading, data, error, post, abort: abortCreationRequest } = useFetch<
    ResearchOutputResponse
  >(`${API_BASE_URL}/users/${profile?.id}/research-outputs`, useFetchOptions());
  const [outputToCreate, setOutputToCreate] = useState<
    ResearchOutputCreationRequest
  >();
  useEffect(() => {
    if (outputToCreate) {
      post(outputToCreate);
    }
    return abortCreationRequest;
  }, [user, outputToCreate, post, abortCreationRequest]);

  return { loading, data, error, post: setOutputToCreate };
};

export const useResearchOutputById = (id: string) =>
  useFetch<ResearchOutputResponse>(
    `${API_BASE_URL}/research-outputs/${id}`,
    useFetchOptions(),
    [id],
  );

export const useResearchOutputs = ({ searchQuery, filters }: BasicOptions) =>
  useApiGet<ListResearchOutputResponse>('/research-outputs', {
    search: searchQuery,
    filter: filters,
  });
